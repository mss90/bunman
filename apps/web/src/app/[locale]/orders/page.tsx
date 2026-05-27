"use client";

import { Bunman } from "@bunman/mascot";
import { useEffect, useState } from "react";
import "@bunman/mascot/animations.css";
import { Link } from "@/i18n/navigation";
import { formatUsd } from "@/lib/formatPrice";
import { StatusPill } from "@bunman/ui";

interface RecentOrder {
	shortId: string;
	status: string;
	totalUsd: string;
	placedAt: string;
	type: string;
}

export default function OrdersHistoryPage() {
	const [orders, setOrders] = useState<RecentOrder[]>([]);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		try {
			const stored = localStorage.getItem("bunman-recent-orders");
			if (stored) {
				setOrders(JSON.parse(stored) as RecentOrder[]);
			}
		} catch {
			/* empty */
		}
		setLoaded(true);
	}, []);

	const clearHistory = () => {
		localStorage.removeItem("bunman-recent-orders");
		setOrders([]);
	};

	if (!loaded) return null;

	return (
		<section className="mx-auto max-w-7xl px-5 py-16">
			<p className="caps text-meat">your orders.</p>
			<h1 className="font-display mt-2 text-5xl text-ink">your tantrum log.</h1>

			{orders.length === 0 ? (
				<div className="mt-16 flex flex-col items-center gap-4 text-center">
					<Bunman pose="empty" size={160} />
					<p className="caps text-ink-soft">no orders yet.</p>
					<Link
						href="/menu"
						className="rounded-full bg-meat px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-meat-deep"
					>
						go grab one
					</Link>
				</div>
			) : (
				<>
					<div className="mt-10 space-y-4">
						{orders.map((order) => (
							<Link
								key={order.shortId}
								href={`/order/${order.shortId}`}
								className="flex items-center justify-between rounded-xl border border-rule bg-paper-2 p-4 transition-colors hover:border-ink/20"
							>
								<div>
									<p className="font-semibold text-ink">#{order.shortId}</p>
									<p className="mt-0.5 text-sm text-ink-soft">
										{new Date(order.placedAt).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
											hour: "2-digit",
											minute: "2-digit",
										})}
										{" · "}
										{order.type}
									</p>
								</div>
								<div className="flex items-center gap-3">
									<StatusPill status={order.status} />
									<span className="num font-semibold text-ink">{formatUsd(order.totalUsd)}</span>
								</div>
							</Link>
						))}
					</div>
					<button
						type="button"
						onClick={clearHistory}
						className="caps mt-8 text-meat hover:text-meat-deep"
					>
						Clear history
					</button>
				</>
			)}
		</section>
	);
}
