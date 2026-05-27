import { z } from "zod";
import { OrderStatus, OrderType, PaymentMethod, PaymentStatus } from "./enums";

export const CreateOrderItemSchema = z.object({
	menuItemId: z.string().uuid(),
	qty: z.number().int().min(1).max(20),
	modifierIds: z.array(z.string().uuid()).default([]),
});
export type CreateOrderItem = z.infer<typeof CreateOrderItemSchema>;

export const CreateOrderSchema = z
	.object({
		branchId: z.string().uuid(),
		customerName: z.string().min(1).max(100),
		customerPhone: z.string().min(8).max(20),
		customerEmail: z.string().email().optional(),
		type: OrderType,
		deliveryZoneId: z.string().uuid().optional(),
		addressJson: z.string().optional(),
		paymentMethod: PaymentMethod,
		kitchenNotes: z.string().max(280).optional(),
		items: z.array(CreateOrderItemSchema).min(1).max(50),
	})
	.refine(
		(data) => {
			if (data.type === "delivery") {
				return !!data.deliveryZoneId;
			}
			return true;
		},
		{ message: "deliveryZoneId required for delivery orders", path: ["deliveryZoneId"] },
	);
export type CreateOrder = z.infer<typeof CreateOrderSchema>;

export const OrderItemModifierSchema = z.object({
	id: z.string().uuid(),
	modifierId: z.string().uuid(),
	extraUsd: z.string(),
	extraLbp: z.number().int(),
	nameSnapshot: z.string(),
});

export const OrderItemSchema = z.object({
	id: z.string().uuid(),
	menuItemId: z.string().uuid(),
	qty: z.number().int(),
	unitPriceUsd: z.string(),
	unitPriceLbp: z.number().int(),
	lineTotalUsd: z.string(),
	lineTotalLbp: z.number().int(),
	nameSnapshot: z.string(),
	modifiers: z.array(OrderItemModifierSchema),
});

export const OrderSchema = z.object({
	id: z.string().uuid(),
	shortId: z.string(),
	branchId: z.string().uuid(),
	customerName: z.string(),
	customerPhone: z.string(),
	customerEmail: z.string().nullable(),
	type: OrderType,
	addressJson: z.string().nullable(),
	deliveryZoneId: z.string().uuid().nullable(),
	paymentMethod: PaymentMethod,
	paymentStatus: PaymentStatus,
	status: OrderStatus,
	subtotalUsd: z.string(),
	vatUsd: z.string(),
	deliveryFeeUsd: z.string(),
	totalUsd: z.string(),
	subtotalLbp: z.number().int(),
	vatLbp: z.number().int(),
	deliveryFeeLbp: z.number().int(),
	totalLbp: z.number().int(),
	kitchenNotes: z.string().nullable(),
	createdAt: z.string(),
	items: z.array(OrderItemSchema),
});
export type Order = z.infer<typeof OrderSchema>;

export const UpdateOrderStatusSchema = z.object({
	status: OrderStatus,
});
export type UpdateOrderStatus = z.infer<typeof UpdateOrderStatusSchema>;
