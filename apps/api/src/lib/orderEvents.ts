import { EventEmitter } from "node:events";

const emitter = new EventEmitter();
emitter.setMaxListeners(100);

export interface OrderEvent {
	type: "created" | "updated";
	orderId: string;
	shortId: string;
	status: string;
	timestamp: string;
}

export function emitOrderCreated(event: Omit<OrderEvent, "type" | "timestamp">) {
	const full: OrderEvent = { ...event, type: "created", timestamp: new Date().toISOString() };
	emitter.emit("order:created", full);
	emitter.emit(`order:${event.orderId}:updated`, full);
}

export function emitOrderUpdated(event: Omit<OrderEvent, "type" | "timestamp">) {
	const full: OrderEvent = { ...event, type: "updated", timestamp: new Date().toISOString() };
	emitter.emit(`order:${event.orderId}:updated`, full);
	emitter.emit("order:any", full);
}

export function onOrderForId(orderId: string, handler: (event: OrderEvent) => void): () => void {
	const eventName = `order:${orderId}:updated`;
	emitter.on(eventName, handler);
	return () => emitter.off(eventName, handler);
}

export function onAnyOrder(handler: (event: OrderEvent) => void): () => void {
	emitter.on("order:created", handler);
	emitter.on("order:any", handler);
	return () => {
		emitter.off("order:created", handler);
		emitter.off("order:any", handler);
	};
}
