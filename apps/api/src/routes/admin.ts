import {
	and,
	branchItemStatus,
	branches,
	desc,
	eq,
	inArray,
	menuItems,
	orderItemModifiers,
	orderItems,
	orders,
} from "@bunman/db";
import {
	CreateMenuItemSchema,
	UpdateBranchItemStatusSchema,
	UpdateBranchSchema,
	UpdateMenuItemSchema,
} from "@bunman/schemas";
import type { FastifyPluginAsync } from "fastify";
import { requireStaff } from "../lib/auth.js";
import { db } from "../lib/db.js";
import { badRequest, notFound } from "../lib/errors.js";
import { onAnyOrder } from "../lib/orderEvents.js";

export const adminRoutes: FastifyPluginAsync = async (app) => {
	app.addHook("preHandler", async (request) => {
		await requireStaff(request);
	});

	app.get("/v1/admin/orders", async (request) => {
		const query = request.query as { status?: string; limit?: string; offset?: string };
		const limit = Math.min(Number(query.limit ?? "50"), 100);
		const offset = Number(query.offset ?? "0");

		let q = db.select().from(orders).orderBy(desc(orders.createdAt)).limit(limit).offset(offset);

		if (query.status) {
			const statuses = query.status.split(",");
			q = q.where(inArray(orders.status, statuses as never)) as typeof q;
		}

		const result = await q;

		const ordersWithItems = await Promise.all(
			result.map(async (order) => {
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
			}),
		);

		return ordersWithItems;
	});

	app.get("/v1/admin/orders/live", async (request, reply) => {
		reply.raw.writeHead(200, {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			Connection: "keep-alive",
		});

		reply.raw.write(`data: ${JSON.stringify({ type: "connected" })}\n\n`);

		const unsubscribe = onAnyOrder((event) => {
			reply.raw.write(`data: ${JSON.stringify(event)}\n\n`);
		});

		request.raw.on("close", () => {
			unsubscribe();
		});
	});

	app.patch("/v1/admin/menu-items/:id", async (request) => {
		const { id } = request.params as { id: string };
		const parsed = UpdateMenuItemSchema.safeParse(request.body);
		if (!parsed.success) {
			throw badRequest("Invalid data", { issues: parsed.error.issues });
		}

		const updatedRows = await db
			.update(menuItems)
			.set({ ...parsed.data, updatedAt: new Date() })
			.where(eq(menuItems.id, id))
			.returning();
		const updated = updatedRows[0];

		if (!updated) throw notFound("Menu item not found");
		return updated;
	});

	app.post("/v1/admin/menu-items", async (request, reply) => {
		const parsed = CreateMenuItemSchema.safeParse(request.body);
		if (!parsed.success) {
			throw badRequest("Invalid data", { issues: parsed.error.issues });
		}

		const createdRows = await db.insert(menuItems).values(parsed.data).returning();
		reply.status(201);
		return createdRows[0];
	});

	app.patch("/v1/admin/branch-item-status", async (request) => {
		const parsed = UpdateBranchItemStatusSchema.safeParse(request.body);
		if (!parsed.success) {
			throw badRequest("Invalid data", { issues: parsed.error.issues });
		}

		const existing = await db
			.select()
			.from(branchItemStatus)
			.where(
				and(
					eq(branchItemStatus.branchId, parsed.data.branchId),
					eq(branchItemStatus.menuItemId, parsed.data.menuItemId),
				),
			);

		if (existing.length > 0) {
			await db
				.update(branchItemStatus)
				.set({ isAvailable: parsed.data.isAvailable })
				.where(
					and(
						eq(branchItemStatus.branchId, parsed.data.branchId),
						eq(branchItemStatus.menuItemId, parsed.data.menuItemId),
					),
				);
		} else {
			await db.insert(branchItemStatus).values(parsed.data);
		}

		return { ok: true };
	});

	app.patch("/v1/admin/branches/:id", async (request) => {
		const { id } = request.params as { id: string };
		const parsed = UpdateBranchSchema.safeParse(request.body);
		if (!parsed.success) {
			throw badRequest("Invalid data", { issues: parsed.error.issues });
		}

		const branchRows = await db
			.update(branches)
			.set({ ...parsed.data, updatedAt: new Date() })
			.where(eq(branches.id, id))
			.returning();
		const updated = branchRows[0];

		if (!updated) throw notFound("Branch not found");
		return updated;
	});

	// TODO(launch): signed R2 URL generation for photo uploads
	app.post("/v1/admin/photos/upload-url", async (_request, reply) => {
		reply.status(501);
		return { error: { code: "NOT_IMPLEMENTED", message: "Photo uploads coming in launch phase" } };
	});
};
