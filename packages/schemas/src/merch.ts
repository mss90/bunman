import { z } from "zod";
import { MerchOrderStatus } from "./enums.js";

export const MerchSizeSchema = z.object({
	label: z.string(),
	stock: z.number().int(),
});

export const MerchProductSchema = z.object({
	id: z.string().uuid(),
	slug: z.string(),
	name: z.string(),
	description: z.string(),
	photoUrls: z.array(z.string()),
	priceUsd: z.string(),
	priceLbp: z.number().int(),
	sizes: z.array(MerchSizeSchema),
	isVisible: z.boolean(),
	displayOrder: z.number().int(),
});
export type MerchProduct = z.infer<typeof MerchProductSchema>;

export const CreateMerchOrderItemSchema = z.object({
	merchProductId: z.string().uuid(),
	size: z.string(),
	qty: z.number().int().min(1).max(10),
});

export const CreateMerchOrderSchema = z.object({
	customerName: z.string().min(1).max(100),
	email: z.string().email(),
	phone: z.string().min(8).max(20),
	addressJson: z.string(),
	items: z.array(CreateMerchOrderItemSchema).min(1).max(20),
});
export type CreateMerchOrder = z.infer<typeof CreateMerchOrderSchema>;

export const MerchOrderSchema = z.object({
	id: z.string().uuid(),
	shortId: z.string(),
	customerName: z.string(),
	email: z.string(),
	phone: z.string(),
	addressJson: z.string(),
	totalUsd: z.string(),
	totalLbp: z.number().int(),
	status: MerchOrderStatus,
	createdAt: z.string(),
});
export type MerchOrder = z.infer<typeof MerchOrderSchema>;
