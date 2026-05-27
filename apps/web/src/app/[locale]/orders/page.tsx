"use client";

import { Bunman } from "@bunman/mascot";
import "@bunman/mascot/animations.css";
import { Link } from "@/i18n/navigation";
import { formatUsd } from "@/lib/formatPrice";
import { type RecentOrder, recentOrders } from "@/lib/recentOrders";
import { StatusPill } from "@bunman/ui";
import { useEffect, useState } from "react";

export default function OrdersHistoryPage() {
	const [orders, setOrders] = useState<RecentOrder[]>([]);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		recentOrders
			.list()
			.then(setOrders)
			.finally(() => setLoaded(true));
	}, []);

	const clearHistory = async () => {
		await recentOrders.clear();
		setOrders([]);
	};

	if (!loaded) return null;

	return (
		<section className="mx-auto max-w-7xl px-5 py-16">
			<p className="caps text-ink-soft">your orders.</p>
			<h1 className="font-display mt-2 text-5xl text-ink">your tantrum log.</h1>

			{orders.length === 0 ? (
				<div className="mt-16 flex flex-col items-center gap-4 text-center">
					<Bunman pose="empty" size={160} />
					<p className="caps text-ink-soft">no orders yet.</p>
					<Link
						href="/menu"
						className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition-opacity hover:opacity-80"
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
						className="caps mt-8 text-ink underline underline-offset-2 hover:opacity-70"
					>
						Clear history
					</button>
				</>
			)}
		</section>
	);
}
