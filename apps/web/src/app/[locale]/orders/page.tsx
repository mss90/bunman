"use client";

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
		<section className="mx-auto max-w-2xl px-5 py-16">
			<h1 className="font-display text-center text-4xl uppercase tracking-wide text-ink">
				YOUR ORDERS
			</h1>

			{orders.length === 0 ? (
				<div className="mt-20 flex flex-col items-center gap-5 text-center">
					{/* Empty state icon */}
					<div className="flex h-20 w-20 items-center justify-center rounded-full bg-black/5">
						<svg
							aria-hidden="true"
							width="32"
							height="32"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="text-black/30"
						>
							<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
							<line x1="3" y1="6" x2="21" y2="6" />
							<path d="M16 10a4 4 0 01-8 0" />
						</svg>
					</div>
					<div>
						<p className="text-base font-semibold text-ink">No orders yet</p>
						<p className="mt-1 text-sm text-black/40">Your order history will appear here</p>
					</div>
					<Link
						href="/menu"
						className="mt-2 rounded-full bg-black px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-80"
					>
						Start ordering
					</Link>
				</div>
			) : (
				<>
					<div className="mt-8 space-y-3">
						{orders.map((order) => (
							<Link
								key={order.shortId}
								href={`/order/${order.shortId}`}
								className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
							>
								<div>
									<p className="text-base font-semibold text-ink">#{order.shortId}</p>
									<p className="mt-1 text-sm text-black/40">
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
									<span className="num text-base font-semibold text-ink">
										{formatUsd(order.totalUsd)}
									</span>
								</div>
							</Link>
						))}
					</div>
					<div className="mt-8 text-center">
						<button
							type="button"
							onClick={clearHistory}
							className="text-sm text-black/40 underline underline-offset-2 transition-opacity hover:opacity-70"
						>
							Clear history
						</button>
					</div>
				</>
			)}
		</section>
	);
}
