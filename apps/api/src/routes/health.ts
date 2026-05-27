import type { FastifyPluginAsync } from "fastify";

const startedAt = Date.now();

export const healthRoutes: FastifyPluginAsync = async (app) => {
	app.get("/v1/health", async () => {
		return {
			ok: true,
			version: "0.1.0",
			uptime: Math.floor((Date.now() - startedAt) / 1000),
		};
	});
};
