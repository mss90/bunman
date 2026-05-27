"use client";

import { adminGet, adminPatch } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { useCallback, useEffect, useRef, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type OrderItem = {
	name: string;
	qty: number;
	price: number;
};

type Order = {
	id: string;
	shortId: string;
	status: string;
	type: string;
	customerName: string;
	customerPhone: string;
	items: OrderItem[];
	total: number;
	createdAt: string;
};

const STATUS_FILTERS = [
	{ label: "All", value: "" },
	{ label: "New", value: "received" },
	{ label: "Cooking", value: "cooking" },
	{ label: "Ready", value: "ready" },
	{ label: "Delivering", value: "out_for_delivery" },
	{ label: "Done", value: "delivered" },
];

const ACTIVE_STATUSES = "received,cooking,ready,out_for_delivery";

const NEXT_STATUS: Record<string, { label: string; next: string }> = {
	received: { label: "Mark cooking", next: "cooking" },
	cooking: { label: "Mark ready", next: "ready" },
	ready: { label: "Mark out", next: "out_for_delivery" },
	out_for_delivery: { label: "Mark delivered", next: "delivered" },
};

const STATUS_COLORS: Record<string, string> = {
	received: "border-l-meat bg-meat/5",
	cooking: "border-l-mustard bg-mustard/5",
	ready: "border-l-pickle bg-pickle/5",
	out_for_delivery: "border-l-ink-soft bg-paper-2",
	delivered: "border-l-rule bg-paper-2 opacity-60",
};

function timeAgo(dateStr: string): string {
	const diff = Date.now() - new Date(dateStr).getTime();
	const mins = Math.floor(diff / 60000);
	if (mins < 1) return "just now";
	if (mins < 60) return `${mins} min ago`;
	const hrs = Math.floor(mins / 60);
	if (hrs < 24) return `${hrs}h ago`;
	return `${Math.floor(hrs / 24)}d ago`;
}

function playChime() {
	try {
		const ctx = new AudioContext();
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.connect(gain);
		gain.connect(ctx.destination);
		osc.frequency.value = 880;
		osc.type = "sine";
		gain.gain.value = 0.3;
		osc.start();
		gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
		osc.stop(ctx.currentTime + 0.5);
	} catch {
		// Audio not available
	}
}

export default function OrdersPage() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [filter, setFilter] = useState("");
	const [loading, setLoading] = useState(true);
	const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
	const [, setTick] = useState(0);
	const orderIdsRef = useRef<Set<string>>(new Set());

	const fetchOrders = useCallback(async () => {
		try {
			const status = filter || ACTIVE_STATUSES;
			const data = await adminGet<Order[]>(`/v1/admin/orders?status=${status}`);
			setOrders(data);
		} catch {
			// Silently fail — SSE will keep us updated
		} finally {
			setLoading(false);
		}
	}, [filter]);

	// Initial fetch + refetch on filter change
	useEffect(() => {
		setLoading(true);
		fetchOrders();
	}, [fetchOrders]);

	// SSE for live updates
	useEffect(() => {
		const token = getToken();
		if (!token) return;

		const url = `${API}/v1/admin/orders/live?token=${encodeURIComponent(token)}`;
		const es = new EventSource(url);

		es.onmessage = (event) => {
			try {
				const order = JSON.parse(event.data) as Order;

				// Play chime for new orders
				if (order.status === "received" && !orderIdsRef.current.has(order.id)) {
					playChime();
				}
				orderIdsRef.current.add(order.id);

				setOrders((prev) => {
					const idx = prev.findIndex((o) => o.id === order.id);
					if (idx >= 0) {
						const next = [...prev];
						next[idx] = order;
						return next;
					}
					return [order, ...prev];
				});
			} catch {
				// Ignore malformed events
			}
		};

		es.onerror = () => {
			// EventSource will auto-reconnect
		};

		return () => es.close();
	}, []);

	// Tick for live "X min ago" updates
	useEffect(() => {
		const interval = setInterval(() => setTick((t) => t + 1), 30_000);
		return () => clearInterval(interval);
	}, []);

	async function advanceStatus(orderId: string, nextStatus: string) {
		try {
			await adminPatch(`/v1/orders/${orderId}/status`, {
				status: nextStatus,
			});
			setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o)));
		} catch {
			// Could show toast, keeping simple
		}
	}

	function toggleItems(orderId: string) {
		setExpandedItems((prev) => {
			const next = new Set(prev);
			if (next.has(orderId)) {
				next.delete(orderId);
			} else {
				next.add(orderId);
			}
			return next;
		});
	}

	const filtered = filter ? orders.filter((o) => o.status === filter) : orders;

	return (
		<div>
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
				<h1 className="text-2xl font-bold">Orders</h1>
				<div className="flex flex-wrap gap-2">
					{STATUS_FILTERS.map((f) => (
						<button
							type="button"
							key={f.value}
							onClick={() => setFilter(f.value)}
							className={`
								caps px-3 py-1.5 rounded-full transition-colors
								${
									filter === f.value
										? "bg-meat text-white"
										: "bg-paper-2 text-ink-soft hover:bg-rule"
								}
							`}
						>
							{f.label}
						</button>
					))}
				</div>
			</div>

			{loading ? (
				<div className="flex justify-center py-20">
					<div className="h-8 w-8 animate-spin rounded-full border-2 border-rule border-t-meat" />
				</div>
			) : filtered.length === 0 ? (
				<div className="text-center py-20 text-ink-soft">
					<p className="text-lg">No orders found</p>
				</div>
			) : (
				<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
					{filtered.map((order) => {
						const action = NEXT_STATUS[order.status];
						const colorClass = STATUS_COLORS[order.status] ?? "bg-paper-2";
						const itemsExpanded = expandedItems.has(order.id);

						return (
							<div key={order.id} className={`rounded-xl border-l-4 p-4 ${colorClass}`}>
								<div className="flex items-start justify-between mb-3">
									<div>
										<span className="font-bold text-lg num">#{order.shortId}</span>
										<span className="caps ml-2 text-ink-soft">
											{order.status.replace(/_/g, " ")}
										</span>
									</div>
									<span className="text-xs text-ink-soft num">{timeAgo(order.createdAt)}</span>
								</div>

								<div className="mb-3 space-y-0.5 text-sm">
									<p className="font-medium">{order.customerName}</p>
									<p className="text-ink-soft">{order.customerPhone}</p>
									<p className="caps text-ink-soft">
										{order.type === "delivery" ? "Delivery" : "Pickup"}
									</p>
								</div>

								<button
									type="button"
									onClick={() => toggleItems(order.id)}
									className="text-xs text-ink-soft hover:text-ink mb-2 underline"
								>
									{itemsExpanded
										? "Hide items"
										: `${order.items.length} item${order.items.length !== 1 ? "s" : ""}`}
								</button>

								{itemsExpanded && (
									<ul className="mb-3 space-y-1 text-sm border-t border-rule pt-2">
										{order.items.map((item) => (
											<li key={item.name} className="flex justify-between">
												<span>
													{item.qty}x {item.name}
												</span>
												<span className="num text-ink-soft">${item.price.toFixed(2)}</span>
											</li>
										))}
									</ul>
								)}

								<div className="flex items-center justify-between mt-2 pt-2 border-t border-rule">
									<span className="font-bold num">${order.total.toFixed(2)}</span>
									{action && (
										<button
											type="button"
											onClick={() => advanceStatus(order.id, action.next)}
											className="rounded-lg bg-meat px-4 py-2 text-sm font-semibold text-white hover:bg-meat-deep transition-colors"
										>
											{action.label}
										</button>
									)}
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
