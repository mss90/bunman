import { z } from "zod";

export const DeliveryZoneSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	feeUsd: z.string(),
	feeLbp: z.number().int(),
	minOrderUsd: z.string(),
	etaMinutes: z.number().int(),
});
export type DeliveryZone = z.infer<typeof DeliveryZoneSchema>;

export const DeliveryZoneCheckSchema = z.object({
	lat: z.number(),
	lng: z.number(),
});
export type DeliveryZoneCheck = z.infer<typeof DeliveryZoneCheckSchema>;

export const DeliveryZoneCheckResponseSchema = z
	.object({
		zoneId: z.string().uuid(),
		name: z.string(),
		feeUsd: z.string(),
		feeLbp: z.number().int(),
		etaMinutes: z.number().int(),
	})
	.nullable();
export type DeliveryZoneCheckResponse = z.infer<typeof DeliveryZoneCheckResponseSchema>;
