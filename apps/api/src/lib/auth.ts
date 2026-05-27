import type { FastifyRequest } from "fastify";
import * as jose from "jose";
import { env } from "../env.js";
import { forbidden, unauthorized } from "./errors.js";

const secret = new TextEncoder().encode(env.JWT_SECRET);

interface JwtPayload {
	sub: string;
	role: string;
	email: string;
	[key: string]: unknown;
}

export async function signJwt(payload: JwtPayload): Promise<string> {
	return new jose.SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setExpirationTime("30d")
		.setIssuedAt()
		.sign(secret);
}

export async function verifyJwt(token: string): Promise<JwtPayload> {
	const { payload } = await jose.jwtVerify(token, secret);
	return payload as unknown as JwtPayload;
}

export async function extractUser(request: FastifyRequest): Promise<JwtPayload> {
	const auth = request.headers.authorization;
	if (!auth?.startsWith("Bearer ")) {
		throw unauthorized("Missing authorization header");
	}
	try {
		return await verifyJwt(auth.slice(7));
	} catch {
		throw unauthorized("Invalid or expired token");
	}
}

export async function requireStaff(request: FastifyRequest): Promise<JwtPayload> {
	const user = await extractUser(request);
	if (user.role !== "staff" && user.role !== "admin") {
		throw forbidden("Staff or admin role required");
	}
	return user;
}
