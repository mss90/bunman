import { createHash, randomBytes } from "node:crypto";
import { and, authOtp, eq, gt, isNull, users } from "@bunman/db";
import { MagicLinkExchangeSchema, MagicLinkRequestSchema } from "@bunman/schemas";
import type { FastifyPluginAsync } from "fastify";
import { env } from "../env.js";
import { extractUser, signJwt } from "../lib/auth.js";
import { db } from "../lib/db.js";
import { badRequest, unauthorized } from "../lib/errors.js";

function hashToken(token: string): string {
	return createHash("sha256").update(token).digest("hex");
}

export const authRoutes: FastifyPluginAsync = async (app) => {
	app.post("/v1/auth/magic/request", async (request) => {
		const parsed = MagicLinkRequestSchema.safeParse(request.body);
		if (!parsed.success) {
			throw badRequest("Invalid request", { issues: parsed.error.issues });
		}
		const { email, app: appTarget } = parsed.data;

		const token = randomBytes(32).toString("hex");
		const tokenHash = hashToken(token);
		const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

		await db.insert(authOtp).values({ email, tokenHash, expiresAt });

		const baseUrl = appTarget === "admin" ? env.ADMIN_PUBLIC_URL : env.WEB_PUBLIC_URL;
		const magicUrl = `${baseUrl}/auth/verify?token=${token}`;

		if (env.RESEND_API_KEY) {
			const { Resend } = await import("resend");
			const resend = new Resend(env.RESEND_API_KEY);
			await resend.emails.send({
				from: "BUNMAN <onboarding@resend.dev>",
				to: email,
				subject: "your magic link. don't share it.",
				html: `
					<div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 40px 20px;">
						<h1 style="font-size: 24px; color: #0d0d0d;">BUNMAN</h1>
						<p style="color: #2b2b2b;">Click below to sign in. This link expires in 15 minutes.</p>
						<a href="${magicUrl}" style="display: inline-block; padding: 12px 24px; background: #b62a1a; color: #fff; text-decoration: none; border-radius: 4px; font-weight: 600;">Sign in</a>
						<p style="color: #999; font-size: 12px; margin-top: 24px;">If you didn't request this, ignore it. Bunman doesn't care.</p>
					</div>
				`,
			});
		} else {
			app.log.info({ magicUrl }, "Magic link (no RESEND_API_KEY configured)");
		}

		return { ok: true };
	});

	app.post("/v1/auth/exchange", async (request) => {
		const parsed = MagicLinkExchangeSchema.safeParse(request.body);
		if (!parsed.success) {
			throw badRequest("Invalid request", { issues: parsed.error.issues });
		}
		const { token } = parsed.data;
		const tokenHash = hashToken(token);

		const [otp] = await db
			.select()
			.from(authOtp)
			.where(
				and(
					eq(authOtp.tokenHash, tokenHash),
					isNull(authOtp.usedAt),
					gt(authOtp.expiresAt, new Date()),
				),
			);

		if (!otp) {
			throw unauthorized("Invalid or expired token");
		}

		await db.update(authOtp).set({ usedAt: new Date() }).where(eq(authOtp.id, otp.id));

		const existingUsers = await db.select().from(users).where(eq(users.email, otp.email));
		let user = existingUsers[0];

		if (!user) {
			const created = await db
				.insert(users)
				.values({ email: otp.email, role: "customer" })
				.returning();
			user = created[0]!;
		}

		await db.update(users).set({ lastSignInAt: new Date() }).where(eq(users.id, user.id));

		const jwt = await signJwt({ sub: user.id, role: user.role, email: user.email });

		return {
			jwt,
			user: {
				id: user.id,
				email: user.email,
				phone: user.phone,
				role: user.role,
				lastSignInAt: user.lastSignInAt?.toISOString() ?? null,
			},
		};
	});

	app.get("/v1/auth/me", async (request) => {
		const payload = await extractUser(request);
		const [user] = await db.select().from(users).where(eq(users.id, payload.sub));
		if (!user) throw unauthorized("User not found");
		return {
			id: user.id,
			email: user.email,
			phone: user.phone,
			role: user.role,
			lastSignInAt: user.lastSignInAt?.toISOString() ?? null,
		};
	});
};
