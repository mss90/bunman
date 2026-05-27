import { merchProducts } from "@bunman/db";
import type { FastifyPluginAsync } from "fastify";
import { db } from "../lib/db.js";

export const merchRoutes: FastifyPluginAsync = async (app) => {
	app.get("/v1/merch", async () => {
		const products = await db.select().from(merchProducts).orderBy(merchProducts.displayOrder);
		return products.filter((p) => p.isVisible);
	});

	// TODO(launch): merch order creation with Stripe
	app.post("/v1/merch/orders", async (_request, reply) => {
		reply.status(501);
		return { error: { code: "NOT_IMPLEMENTED", message: "Merch orders coming soon" } };
	});
};
