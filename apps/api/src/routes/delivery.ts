import { deliveryZones } from "@bunman/db";
import type { FastifyPluginAsync } from "fastify";
import { db } from "../lib/db.js";

export const deliveryRoutes: FastifyPluginAsync = async (app) => {
	app.get("/v1/delivery-zones", async () => {
		const zones = await db.select().from(deliveryZones);
		return zones.map((z) => ({
			id: z.id,
			name: z.name,
			feeUsd: z.feeUsd,
			feeLbp: z.feeLbp,
			minOrderUsd: z.minOrderUsd,
			etaMinutes: z.etaMinutes,
		}));
	});

	// TODO(launch): replace with point-in-polygon check using @turf/boolean-point-in-polygon
	app.post("/v1/delivery-zones/check", async (request) => {
		const _body = request.body as { lat: number; lng: number };
		const zones = await db.select().from(deliveryZones);
		const firstZone = zones[0];
		if (!firstZone) return null;
		return {
			zoneId: firstZone.id,
			name: firstZone.name,
			feeUsd: firstZone.feeUsd,
			feeLbp: firstZone.feeLbp,
			etaMinutes: firstZone.etaMinutes,
		};
	});
};
