"use client";

import { Bunman } from "@bunman/mascot";
import type { BunmanPose } from "@bunman/mascot";
import { useEffect, useRef, useState } from "react";
import "@bunman/mascot/animations.css";
import type { Order } from "@/app/[locale]/order/[id]/page";
import { formatUsd } from "@/lib/formatPrice";
import { Caps, StatusPill } from "@bunman/ui";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type OrderStatus = Order["status"];

interface OrderTrackerProps {
	order: Order;
	apiUrl: string;
	justPlaced: boolean;
}

/* ------------------------------------------------------------------ */
/*  Status helpers                                                     */
/* ------------------------------------------------------------------ */

const PICKUP_STEPS: { key: OrderStatus; label: string }[] = [
	{ key: "received", label: "Received" },
	{ key: "cooking", label: "Cooking" },
	{ key: "ready", label: "Ready" },
	{ key: "delivered", label: "Done" },
];

const DELIVERY_STEPS: { key: OrderStatus; label: string }[] = [
	{ key: "received", label: "Received" },
	{ key: "cooking", label: "Cooking" },
	{ key: "ready", label: "Ready" },
	{ key: "out_for_delivery", label: "Out for delivery" },
	{ key: "delivered", label: "Delivered" },
];

function stepIndex(status: OrderStatus, steps: { key: OrderStatus }[]) {
	const idx = steps.findIndex((s) => s.key === status);
	return idx === -1 ? 0 : idx;
}

const poseLookup: Record<OrderStatus, BunmanPose> = {
	received: "idle",
	cooking: "smashing",
	ready: "proud",
	out_for_delivery: "proud",
	delivered: "proud",
	cancelled: "angry",
};

/* ------------------------------------------------------------------ */
/*  Stepper                                                            */
/* ------------------------------------------------------------------ */

function Stepper({
	steps,
	currentIndex,
}: {
	steps: { key: string; label: string }[];
	currentIndex: number;
}) {
	return (
		<div className="flex w-full items-center justify-between gap-1">
			{steps.map((step, i) => {
				const reached = i <= currentIndex;
				const isCurrent = i === currentIndex;

				return (
					<div key={step.key} className="flex flex-1 flex-col items-center gap-2">
						{/* Connector line + dot */}
						<div className="flex w-full items-center">
							{/* Left connector */}
							{i > 0 && (
								<div
									className={`h-0.5 flex-1 transition-colors duration-500 ${
										reached ? "bg-ink" : "bg-rule"
									}`}
								/>
							)}
							{i === 0 && <div className="flex-1" />}

							{/* Dot */}
							<div className="relative flex items-center justify-center">
								<div
									className={`h-3.5 w-3.5 rounded-full border-2 transition-colors duration-500 ${
										reached ? "border-ink bg-ink" : "border-rule bg-paper"
									}`}
								/>
								{isCurrent && (
									<span className="absolute inline-flex h-3.5 w-3.5 animate-ping rounded-full bg-ink opacity-40" />
								)}
							</div>

							{/* Right connector */}
							{i < steps.length - 1 && (
								<div
									className={`h-0.5 flex-1 transition-colors duration-500 ${
										i < currentIndex ? "bg-ink" : "bg-rule"
									}`}
								/>
							)}
							{i === steps.length - 1 && <div className="flex-1" />}
						</div>

						{/* Label */}
						<span
							className={`text-center text-[0.65rem] font-semibold uppercase tracking-wider ${
								reached ? "text-ink" : "text-ink-soft/50"
							}`}
						>
							{step.label}
						</span>
					</div>
				);
			})}
		</div>
	);
}

/* ------------------------------------------------------------------ */
/*  Celebration banner                                                 */
/* ------------------------------------------------------------------ */

function CelebrationBanner() {
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => setVisible(false), 5000);
		return () => clearTimeout(timer);
	}, []);

	if (!visible) return null;

	return (
		<div className="mb-6 flex items-center gap-4 rounded-xl border border-ink/20 bg-ink/5 px-5 py-4">
			<Bunman pose="proud" size={56} />
			<div>
				<p className="font-display text-lg text-ink">you smashed it.</p>
				<p className="text-sm text-ink-soft">Your order is in. Sit tight, Bunman&apos;s on it.</p>
			</div>
		</div>
	);
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export function OrderTracker({ order, apiUrl, justPlaced }: OrderTrackerProps) {
	const [status, setStatus] = useState<OrderStatus>(order.status);
	const sseRef = useRef<EventSource | null>(null);
	const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

	/* ---- SSE subscription with polling fallback ---- */
	useEffect(() => {
		let cancelled = false;

		function connectSSE() {
			if (cancelled) return;

			const es = new EventSource(`${apiUrl}/v1/orders/${order.id}/stream`);
			sseRef.current = es;

			es.onmessage = (event) => {
				try {
					const data = JSON.parse(event.data as string) as {
						status?: OrderStatus;
					};
					if (data.status) {
						setStatus(data.status);
					}
				} catch {
					/* ignore malformed data */
				}
			};

			es.onerror = () => {
				es.close();
				sseRef.current = null;
				if (!cancelled) startPolling();
			};

			/* Stop polling if SSE is alive */
			stopPolling();
		}

		function startPolling() {
			if (cancelled || pollRef.current) return;
			pollRef.current = setInterval(async () => {
				try {
					const res = await fetch(`${apiUrl}/v1/orders/${order.id}`, {
						cache: "no-store",
					});
					if (res.ok) {
						const data = (await res.json()) as { status?: OrderStatus };
						if (data.status) setStatus(data.status);
					}
				} catch {
					/* swallow */
				}
			}, 8000);
		}

		function stopPolling() {
			if (pollRef.current) {
				clearInterval(pollRef.current);
				pollRef.current = null;
			}
		}

		connectSSE();

		return () => {
			cancelled = true;
			sseRef.current?.close();
			stopPolling();
		};
	}, [apiUrl, order.id]);

	/* ---- Derived ---- */
	const steps = order.type === "pickup" ? PICKUP_STEPS : DELIVERY_STEPS;
	const current = stepIndex(status, steps);
	const pose = poseLookup[status] ?? "idle";

	const whatsappUrl = `https://wa.me/9611000000?text=${encodeURIComponent(
		`Hi Bunman! Question about order #${order.shortId}`,
	)}`;

	return (
		<section className="mx-auto max-w-7xl px-5 py-10">
			{/* Celebration banner */}
			{justPlaced && <CelebrationBanner />}

			{/* Header */}
			<div className="flex flex-wrap items-center gap-3">
				<Caps className="text-ink-soft">ORDER #{order.shortId}</Caps>
				<StatusPill status={status} />
			</div>

			{/* Stepper */}
			{status !== "cancelled" && (
				<div className="mt-8">
					<Stepper steps={steps} currentIndex={current} />
				</div>
			)}

			{/* Body: Mascot + Details */}
			<div className="mt-10 grid gap-10 md:grid-cols-[1fr_340px]">
				{/* Mascot */}
				<div className="flex flex-col items-center justify-center rounded-xl bg-paper-2 py-12">
					<Bunman pose={pose} size={220} />
					{status === "cancelled" && (
						<p className="font-display mt-4 text-xl text-ink">Order cancelled.</p>
					)}
				</div>

				{/* Order details sidebar */}
				<div className="space-y-6">
					{/* Type */}
					<div>
						<Caps className="text-ink-soft">Order type</Caps>
						<p className="mt-1 font-semibold capitalize text-ink">{order.type}</p>
					</div>

					{/* Items */}
					<div>
						<Caps className="text-ink-soft">Items</Caps>
						<ul className="mt-2 space-y-2">
							{order.items.map((item, idx) => (
								<li
									key={`${item.nameSnapshot}-${idx}`}
									className="flex items-start justify-between gap-3 text-sm"
								>
									<div className="flex-1">
										<span className="font-semibold text-ink">
											{item.qty}x {item.nameSnapshot}
										</span>
										{item.modifiers.length > 0 && (
											<p className="caps mt-0.5 text-ink-soft/60">
												{item.modifiers.map((m) => m.nameSnapshot).join(", ")}
											</p>
										)}
									</div>
									<span className="num whitespace-nowrap font-semibold text-ink">
										{formatUsd(item.lineTotalUsd)}
									</span>
								</li>
							))}
						</ul>
					</div>

					{/* Totals */}
					<div className="space-y-1 border-t border-rule pt-4">
						<div className="flex justify-between text-sm text-ink-soft">
							<span>Subtotal</span>
							<span className="num">{formatUsd(order.subtotalUsd)}</span>
						</div>
						<div className="flex justify-between text-sm text-ink-soft">
							<span>VAT</span>
							<span className="num">{formatUsd(order.vatUsd)}</span>
						</div>
						{order.type === "delivery" && (
							<div className="flex justify-between text-sm text-ink-soft">
								<span>Delivery</span>
								<span className="num">{formatUsd(order.deliveryFeeUsd)}</span>
							</div>
						)}
						<div className="flex justify-between border-t border-rule pt-2">
							<span className="font-display text-lg text-ink">Total</span>
							<span className="font-display text-lg text-ink">{formatUsd(order.totalUsd)}</span>
						</div>
					</div>

					{/* Payment method */}
					<div>
						<Caps className="text-ink-soft">Payment</Caps>
						<p className="mt-1 text-sm capitalize text-ink">
							{order.paymentMethod.replace(/_/g, " ")}
						</p>
					</div>

					{/* WhatsApp link */}
					<a
						href={whatsappUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="mt-2 inline-block text-sm font-semibold text-ink underline underline-offset-2 transition-opacity hover:opacity-70"
					>
						Text Bunman
					</a>
				</div>
			</div>
		</section>
	);
}
