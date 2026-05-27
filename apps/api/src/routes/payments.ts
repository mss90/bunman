import type { FastifyPluginAsync } from "fastify";

export const paymentRoutes: FastifyPluginAsync = async (app) => {
	// TODO(launch): Stripe webhook — validate signature, handle checkout.session.completed/expired, payment_intent.payment_failed
	app.post("/v1/payments/stripe/webhook", async (_request, reply) => {
		reply.status(200);
		return { received: true };
	});
};
