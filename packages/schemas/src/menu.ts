import { z } from "zod";

export const BranchSchema = z.object({
	id: z.string().uuid(),
	slug: z.string(),
	name: z.string(),
	address: z.string(),
	phone: z.string(),
	whatsapp: z.string(),
	lat: z.number(),
	lng: z.number(),
	isOpen: z.boolean(),
	hoursJson: z.string(),
	timezone: z.string(),
});
export type Branch = z.infer<typeof BranchSchema>;

export const CategorySchema = z.object({
	id: z.string().uuid(),
	slug: z.string(),
	name: z.string(),
	displayOrder: z.number().int(),
	isVisible: z.boolean(),
});
export type Category = z.infer<typeof CategorySchema>;

export const ModifierSchema = z.object({
	id: z.string().uuid(),
	groupId: z.string().uuid(),
	name: z.string(),
	extraUsd: z.string(),
	extraLbp: z.number().int(),
	isDefault: z.boolean(),
	isVisible: z.boolean(),
	displayOrder: z.number().int(),
});
export type Modifier = z.infer<typeof ModifierSchema>;

export const ModifierGroupSchema = z.object({
	id: z.string().uuid(),
	slug: z.string(),
	name: z.string(),
	minSelect: z.number().int(),
	maxSelect: z.number().int(),
	isRequired: z.boolean(),
	displayOrder: z.number().int(),
	modifiers: z.array(ModifierSchema),
});
export type ModifierGroup = z.infer<typeof ModifierGroupSchema>;

export const MenuItemSchema = z.object({
	id: z.string().uuid(),
	categoryId: z.string().uuid(),
	slug: z.string(),
	name: z.string(),
	description: z.string(),
	photoUrl: z.string().nullable(),
	photoBlurDataUrl: z.string().nullable(),
	basePriceUsd: z.string(),
	basePriceLbp: z.number().int(),
	isVegetarian: z.boolean(),
	isVisible: z.boolean(),
	displayOrder: z.number().int(),
	isAvailable: z.boolean(),
	modifierGroups: z.array(ModifierGroupSchema),
});
export type MenuItem = z.infer<typeof MenuItemSchema>;

export const MenuResponseSchema = z.object({
	branches: z.array(BranchSchema),
	categories: z.array(CategorySchema),
	items: z.array(MenuItemSchema),
});
export type MenuResponse = z.infer<typeof MenuResponseSchema>;
