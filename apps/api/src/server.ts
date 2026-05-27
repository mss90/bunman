import "dotenv/config";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import Fastify from "fastify";
import { env } from "./env.js";
import { AppError } from "./lib/errors.js";
import { adminRoutes } from "./routes/admin.js";
import { authRoutes } from "./routes/auth.js";
import { deliveryRoutes } from "./routes/delivery.js";
import { healthRoutes } from "./routes/health.js";
import { menuRoutes } from "./routes/menu.js";
import { merchRoutes } from "./routes/merch.js";
import { orderRoutes } from "./routes/orders.js";
import { paymentRoutes } from "./routes/payments.js";

const app = Fastify({
	logger: {
		transport:
			env.NODE_ENV === "development"
				? { target: "pino-pretty", options: { colorize: true } }
				: undefined,
	},
});

await app.register(cors, {
	origin: [env.WEB_PUBLIC_URL, env.ADMIN_PUBLIC_URL],
	credentials: true,
});

await app.register(helmet, { contentSecurityPolicy: false });
await app.register(cookie);

app.setErrorHandler(
	(error: Error & { validation?: unknown; statusCode?: number }, _request, reply) => {
		if (error instanceof AppError) {
			reply.status(error.statusCode).send({
				error: {
					code: error.code,
					message: error.message,
					details: error.details,
				},
			});
			return;
		}

		if (error.validation) {
			reply.status(400).send({
				error: {
					code: "VALIDATION_ERROR",
					message: error.message,
				},
			});
			return;
		}

		app.log.error(error);
		reply.status(500).send({
			error: {
				code: "INTERNAL_ERROR",
				message: "Something went wrong",
			},
		});
	},
);

await app.register(healthRoutes);
await app.register(menuRoutes);
await app.register(deliveryRoutes);
await app.register(orderRoutes);
await app.register(authRoutes);
await app.register(merchRoutes);
await app.register(paymentRoutes);
await app.register(adminRoutes);

try {
	await app.listen({ port: env.PORT, host: env.HOST });
	app.log.info(`BUNMAN API running on ${env.HOST}:${env.PORT}`);
} catch (err) {
	app.log.fatal(err);
	process.exit(1);
}
