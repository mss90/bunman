import { z } from "zod";

export const OrderType = z.enum(["pickup", "delivery"]);
export type OrderType = z.infer<typeof OrderType>;

export const PaymentMethod = z.enum(["card", "cash_usd", "cash_lbp"]);
export type PaymentMethod = z.infer<typeof PaymentMethod>;

export const PaymentStatus = z.enum(["pending", "paid", "failed", "refunded"]);
export type PaymentStatus = z.infer<typeof PaymentStatus>;

export const OrderStatus = z.enum([
	"received",
	"cooking",
	"ready",
	"out_for_delivery",
	"delivered",
	"cancelled",
]);
export type OrderStatus = z.infer<typeof OrderStatus>;

export const MerchOrderStatus = z.enum(["pending", "fulfilled", "cancelled"]);
export type MerchOrderStatus = z.infer<typeof MerchOrderStatus>;

export const UserRole = z.enum(["customer", "staff", "admin"]);
export type UserRole = z.infer<typeof UserRole>;

export const AppTarget = z.enum(["web", "admin"]);
export type AppTarget = z.infer<typeof AppTarget>;
