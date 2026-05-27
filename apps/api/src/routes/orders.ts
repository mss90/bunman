import { eq, or, orderItemModifiers, orderItems, orders } from "@bunman/db";
import { CreateOrderSchema, UpdateOrderStatusSchema } from "@bunman/schemas";
import type { FastifyPluginAsync } from "fastify";
import { requireStaff } from "../lib/auth.js";
import { db } from "../lib/db.js";
import { badRequest, notFound } from "../lib/errors.js";
import { emitOrderCreated, emitOrderUpdated, onOrderForId } from "../lib/orderEvents.js";
import { priceOrder } from "../lib/pricing.js";
import { generateShortId } from "../lib/shortId.js";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function getOrderWithItems(idOrShortId: string) {
	const condition = UUID_RE.test(idOrShortId)
		? or(eq(orders.id, idOrShortId), eq(orders.shortId, idOrShortId))
		: eq(orders.shortId, idOrShortId);

	const [order] = await db.select().from(orders).where(condition);

	if (!order) return null;

	const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));

	const itemsWithMods = await Promise.all(
		items.map(async (item) => {
			const mods = await db
				.select()
				.from(orderItemModifiers)
				.where(eq(orderItemModifiers.orderItemId, item.id));
			return { ...item, modifiers: mods };
		}),
	);

	return { ...order, items: itemsWithMods };
}

export const orderRoutes: FastifyPluginAsync = async (app) => {
	app.post("/v1/orders", async (request, reply) => {
		const parsed = CreateOrderSchema.safeParse(request.body);
		if (!parsed.success) {
			throw badRequest("Invalid order data", {
				issues: parsed.error.issues,
			});
		}
		const input = parsed.data;

		// TODO(launch): Stripe integration goes here
		if (input.paymentMethod === "card") {
			throw badRequest("Card payments coming soon. Please use cash for now.");
		}

		const priced = await priceOrder({
			items: input.items,
			branchId: input.branchId,
			type: input.type,
			deliveryZoneId: input.deliveryZoneId,
		});

		const shortId = generateShortId();

		const orderRows = await db
			.insert(orders)
			.values({
				shortId,
				branchId: input.branchId,
				customerName: input.customerName,
				customerPhone: input.customerPhone,
				customerEmail: input.customerEmail ?? null,
				type: input.type,
				addressJson: input.addressJson ?? null,
				deliveryZoneId: input.deliveryZoneId ?? null,
				paymentMethod: input.paymentMethod,
				paymentStatus: "pending",
				status: "received",
				subtotalUsd: priced.subtotalUsd,
				vatUsd: priced.vatUsd,
				deliveryFeeUsd: priced.deliveryFeeUsd,
				totalUsd: priced.totalUsd,
				subtotalLbp: priced.subtotalLbp,
				vatLbp: priced.vatLbp,
				deliveryFeeLbp: priced.deliveryFeeLbp,
				totalLbp: priced.totalLbp,
				kitchenNotes: input.kitchenNotes ?? null,
			})
			.returning();
		const order = orderRows[0]!;

		for (const line of priced.lines) {
			const itemRows = await db
				.insert(orderItems)
				.values({
					orderId: order.id,
					menuItemId: line.menuItemId,
					qty: line.qty,
					unitPriceUsd: line.unitUsd,
					unitPriceLbp: line.unitLbp,
					lineTotalUsd: line.lineUsd,
					lineTotalLbp: line.lineLbp,
					nameSnapshot: line.name,
				})
				.returning();
			const insertedItem = itemRows[0]!;

			for (const mod of line.modifiers) {
				await db.insert(orderItemModifiers).values({
					orderItemId: insertedItem.id,
					modifierId: mod.modifierId,
					extraUsd: mod.extraUsd,
					extraLbp: mod.extraLbp,
					nameSnapshot: mod.name,
				});
			}
		}

		emitOrderCreated({ orderId: order.id, shortId: order.shortId, status: order.status });

		const full = await getOrderWithItems(order.id);
		reply.status(201);
		return { order: full };
	});

	app.get("/v1/orders/:idOrShortId", async (request) => {
		const { idOrShortId } = request.params as { idOrShortId: string };
		const order = await getOrderWithItems(idOrShortId);
		if (!order) throw notFound("Order not found");
		return order;
	});

	app.patch("/v1/orders/:id/status", async (request) => {
		await requireStaff(request);

		const { id } = request.params as { id: string };
		const parsed = UpdateOrderStatusSchema.safeParse(request.body);
		if (!parsed.success) {
			throw badRequest("Invalid status", { issues: parsed.error.issues });
		}

		const updatedRows = await db
			.update(orders)
			.set({
				status: parsed.data.status,
				updatedAt: new Date(),
				...(parsed.data.status === "delivered" ? { deliveredAt: new Date() } : {}),
			})
			.where(eq(orders.id, id))
			.returning();
		const updated = updatedRows[0];

		if (!updated) throw notFound("Order not found");

		emitOrderUpdated({
			orderId: updated.id,
			shortId: updated.shortId,
			status: updated.status,
		});

		return updated;
	});

	app.get("/v1/orders/:id/stream", async (request, reply) => {
		const { id } = request.params as { id: string };

		const [order] = await db.select().from(orders).where(eq(orders.id, id));
		if (!order) throw notFound("Order not found");

		reply.raw.writeHead(200, {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			Connection: "keep-alive",
		});

		reply.raw.write(`data: ${JSON.stringify({ type: "connected", status: order.status })}\n\n`);

		const unsubscribe = onOrderForId(id, (event) => {
			reply.raw.write(`data: ${JSON.stringify(event)}\n\n`);
		});

		request.raw.on("close", () => {
			unsubscribe();
		});
	});
};
