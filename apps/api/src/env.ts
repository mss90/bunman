function required(key: string): string {
	const value = process.env[key];
	if (!value) {
		throw new Error(`Missing required environment variable: ${key}`);
	}
	return value;
}

function optional(key: string, fallback: string): string {
	return process.env[key] ?? fallback;
}

export const env = {
	DATABASE_URL: required("DATABASE_URL"),
	JWT_SECRET: required("JWT_SECRET"),
	RESEND_API_KEY: optional("RESEND_API_KEY", ""),
	WEB_PUBLIC_URL: optional("WEB_PUBLIC_URL", "http://localhost:3000"),
	ADMIN_PUBLIC_URL: optional("ADMIN_PUBLIC_URL", "http://localhost:3002"),
	FX_RATE_LBP: Number(optional("FX_RATE_LBP", "89500")),
	PORT: Number(optional("PORT", "3001")),
	HOST: optional("HOST", "0.0.0.0"),
	NODE_ENV: optional("NODE_ENV", "development"),
} as const;
