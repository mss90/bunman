import { Bunman } from "@bunman/mascot";
import "@bunman/mascot/animations.css";
import { OrderTracker } from "@/components/OrderTracker";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

interface OrderItem {
	nameSnapshot: string;
	qty: number;
	lineTotalUsd: string;
	modifiers: { nameSnapshot: string }[];
}

export interface Order {
	id: string;
	shortId: string;
	status: "received" | "cooking" | "ready" | "out_for_delivery" | "delivered" | "cancelled";
	type: "pickup" | "delivery";
	customerName: string;
	customerPhone: string;
	paymentMethod: string;
	subtotalUsd: string;
	vatUsd: string;
	deliveryFeeUsd: string;
	totalUsd: string;
	items: OrderItem[];
}

async function fetchOrder(id: string): Promise<Order | null> {
	try {
		const res = await fetch(`${API_URL}/v1/orders/${id}`, {
			cache: "no-store",
		});
		if (!res.ok) return null;
		return (await res.json()) as Order;
	} catch {
		return null;
	}
}

export default async function OrderTrackerPage({
	params,
	searchParams,
}: {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ placed?: string }>;
}) {
	const { id } = await params;
	const { placed } = await searchParams;
	const order = await fetchOrder(id);

	if (!order) {
		return (
			<section className="mx-auto flex max-w-7xl flex-col items-center px-5 py-24 text-center">
				<Bunman pose="angry" size={180} />
				<h1 className="font-display mt-6 text-4xl text-ink">Order not found.</h1>
				<p className="mt-3 max-w-md text-ink-soft">
					We couldn&apos;t find that order. It may have been removed, or the link might be wrong.
					Double-check and try again.
				</p>
			</section>
		);
	}

	return <OrderTracker order={order} apiUrl={API_URL} justPlaced={placed === "1"} />;
}
