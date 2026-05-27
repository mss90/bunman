import { z } from "zod";

export const UpdateMenuItemSchema = z.object({
	name: z.string().min(1).optional(),
	description: z.string().optional(),
	basePriceUsd: z.string().optional(),
	basePriceLbp: z.number().int().optional(),
	photoUrl: z.string().url().nullable().optional(),
	photoBlurDataUrl: z.string().nullable().optional(),
	isVegetarian: z.boolean().optional(),
	isVisible: z.boolean().optional(),
	displayOrder: z.number().int().optional(),
});
export type UpdateMenuItem = z.infer<typeof UpdateMenuItemSchema>;

export const CreateMenuItemSchema = z.object({
	categoryId: z.string().uuid(),
	slug: z.string().min(1),
	name: z.string().min(1),
	description: z.string(),
	basePriceUsd: z.string(),
	basePriceLbp: z.number().int(),
	photoUrl: z.string().url().nullable().default(null),
	photoBlurDataUrl: z.string().nullable().default(null),
	isVegetarian: z.boolean().default(false),
	isVisible: z.boolean().default(true),
	displayOrder: z.number().int().default(0),
});
export type CreateMenuItem = z.infer<typeof CreateMenuItemSchema>;

export const UpdateBranchItemStatusSchema = z.object({
	branchId: z.string().uuid(),
	menuItemId: z.string().uuid(),
	isAvailable: z.boolean(),
});
export type UpdateBranchItemStatus = z.infer<typeof UpdateBranchItemStatusSchema>;

export const UpdateBranchSchema = z.object({
	isOpen: z.boolean().optional(),
	hoursJson: z.string().optional(),
});
export type UpdateBranch = z.infer<typeof UpdateBranchSchema>;
