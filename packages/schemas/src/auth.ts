import { z } from "zod";
import { AppTarget } from "./enums";

export const MagicLinkRequestSchema = z.object({
	email: z.string().email(),
	app: AppTarget,
});
export type MagicLinkRequest = z.infer<typeof MagicLinkRequestSchema>;

export const MagicLinkExchangeSchema = z.object({
	token: z.string().min(1),
});
export type MagicLinkExchange = z.infer<typeof MagicLinkExchangeSchema>;

export const UserSchema = z.object({
	id: z.string().uuid(),
	email: z.string().email(),
	phone: z.string().nullable(),
	role: z.string(),
	lastSignInAt: z.string().nullable(),
});
export type User = z.infer<typeof UserSchema>;

export const AuthResponseSchema = z.object({
	jwt: z.string(),
	user: UserSchema,
});
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
