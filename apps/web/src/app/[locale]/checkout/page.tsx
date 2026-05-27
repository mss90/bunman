"use client";

import { Link, useRouter } from "@/i18n/navigation";
import { modKey, useCartStore } from "@/lib/cartStore";
import { formatLbp, formatUsd } from "@/lib/formatPrice";
import { recentOrders } from "@/lib/recentOrders";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface DeliveryZone {
	id: string;
	name: string;
	feeUsd: string;
	feeLbp: number;
	minOrderUsd: string;
	etaMinutes: number;
}

type OrderType = "pickup" | "delivery";
type PaymentMethod = "cash_usd" | "cash_lbp" | "card";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function CheckoutPage() {
	const t = useTranslations("checkout");
	const router = useRouter();

	/* ── Cart ────────────────────────────────────────────────────── */
	const items = useCartStore((s) => s.items);
	const clearCart = useCartStore((s) => s.clear);
	const subtotalUsd = useCartStore((s) => s.subtotalUsd());

	/* ── Branch (first from /v1/menu) ───────────────────────────── */
	const [branchId, setBranchId] = useState<string | null>(null);

	const [apiDown, setApiDown] = useState(false);

	useEffect(() => {
		fetch(`${API_URL}/v1/menu`)
			.then((r) => r.json())
			.then((data) => {
				const first = data?.branches?.[0];
				if (first) setBranchId(first.id);
			})
			.catch(() => {
				setApiDown(true);
			});
	}, []);

	/* ── Delivery zones ──────────────────────────────────────────── */
	const [zones, setZones] = useState<DeliveryZone[]>([]);

	useEffect(() => {
		fetch(`${API_URL}/v1/delivery-zones`)
			.then((r) => r.json())
			.then((data: DeliveryZone[]) => setZones(data))
			.catch(() => {});
	}, []);

	/* ── Form state ──────────────────────────────────────────────── */
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("");
	const [orderType, setOrderType] = useState<OrderType>("pickup");
	const [selectedZoneId, setSelectedZoneId] = useState("");
	const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash_usd");
	const [notes, setNotes] = useState("");

	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");

	/* ── Derived values ──────────────────────────────────────────── */
	const selectedZone = useMemo(
		() => zones.find((z) => z.id === selectedZoneId) ?? null,
		[zones, selectedZoneId],
	);

	const deliveryFeeUsd = orderType === "delivery" && selectedZone ? Number(selectedZone.feeUsd) : 0;
	const vatUsd = subtotalUsd * 0.11;
	const totalUsd = subtotalUsd + vatUsd + deliveryFeeUsd;

	const formValid =
		name.trim().length > 0 &&
		phone.trim().length >= 6 &&
		items.length > 0 &&
		(orderType === "pickup" || selectedZoneId !== "") &&
		paymentMethod !== "card" &&
		branchId !== null;

	/* ── Submit ──────────────────────────────────────────────────── */
	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();
			if (!formValid || submitting) return;

			setSubmitting(true);
			setError("");

			const body = {
				branchId,
				customerName: name.trim(),
				customerPhone: `+961${phone.replace(/\s/g, "")}`,
				...(email.trim() ? { customerEmail: email.trim() } : {}),
				type: orderType,
				...(orderType === "delivery" ? { deliveryZoneId: selectedZoneId } : {}),
				paymentMethod,
				...(notes.trim() ? { kitchenNotes: notes.trim() } : {}),
				items: items.map((item) => ({
					menuItemId: item.menuItemId,
					qty: item.qty,
					modifierIds: item.modifiers.map((m) => m.id),
				})),
			};

			try {
				const res = await fetch(`${API_URL}/v1/orders`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(body),
				});

				if (!res.ok) {
					const data = await res.json().catch(() => ({}));
					throw new Error(data?.error?.message ?? "Request failed");
				}

				const data = await res.json();
				const shortId = data?.order?.shortId;

				await recentOrders.add({
					shortId,
					status: "received",
					totalUsd: totalUsd.toFixed(2),
					placedAt: new Date().toISOString(),
					type: orderType,
					customerName: name.trim(),
				});

				clearCart();
				router.push(`/order/${shortId}?placed=1`);
			} catch (err) {
				const msg = err instanceof Error ? err.message : "";
				if (msg === "Failed to fetch" || msg === "Load failed") {
					setError(
						"Ordering is temporarily unavailable. Please try again or call us at +961 3 286 626",
					);
				} else {
					setError(msg || t("orderError"));
				}
				setSubmitting(false);
			}
		},
		[
			formValid,
			submitting,
			branchId,
			name,
			phone,
			email,
			orderType,
			selectedZoneId,
			paymentMethod,
			notes,
			items,
			clearCart,
			router,
			t,
			totalUsd,
		],
	);

	/* ── Empty cart state ────────────────────────────────────────── */
	if (items.length === 0) {
		return (
			<section className="mx-auto flex max-w-7xl flex-col items-center px-5 py-24">
				<p className="caps text-ink-soft">{t("emptyCart")}</p>
				<Link
					href="/menu"
					className="caps mt-4 text-ink underline underline-offset-2 hover:opacity-70"
				>
					{t("goMenu")}
				</Link>
			</section>
		);
	}

	/* ── Render ──────────────────────────────────────────────────── */
	return (
		<section className="mx-auto max-w-7xl px-5 py-12">
			<p className="caps text-ink-soft">{t("eyebrow")}</p>

			<form onSubmit={handleSubmit} className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-12">
				{/* ════════════════ LEFT — FORM ════════════════ */}
				<div className="space-y-10 lg:col-span-7">
					{/* ── Section 1: Who's this for? ────────── */}
					<fieldset>
						<legend className="caps text-ink-soft">{t("whoFor")}</legend>
						<div className="mt-4 space-y-4">
							{/* Name */}
							<div>
								<label htmlFor="ck-name" className="sr-only">
									{t("name")}
								</label>
								<input
									id="ck-name"
									type="text"
									required
									placeholder={t("namePlaceholder")}
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="w-full rounded-xl border border-rule bg-paper-2 px-4 py-3 text-sm text-ink placeholder:text-ink-soft/40 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
								/>
							</div>

							{/* Phone */}
							<div className="relative">
								<label htmlFor="ck-phone" className="sr-only">
									{t("phone")}
								</label>
								<span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-ink-soft">
									+961
								</span>
								<input
									id="ck-phone"
									type="tel"
									required
									placeholder={t("phonePlaceholder")}
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
									className="w-full rounded-xl border border-rule bg-paper-2 py-3 pl-14 pr-4 text-sm text-ink placeholder:text-ink-soft/40 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
								/>
							</div>

							{/* Email */}
							<div>
								<label htmlFor="ck-email" className="sr-only">
									{t("email")}
								</label>
								<input
									id="ck-email"
									type="email"
									placeholder={t("emailPlaceholder")}
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full rounded-xl border border-rule bg-paper-2 px-4 py-3 text-sm text-ink placeholder:text-ink-soft/40 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
								/>
							</div>
						</div>
					</fieldset>

					{/* ── Section 2: Pickup or delivery? ─────── */}
					<fieldset>
						<legend className="caps text-ink-soft">{t("fulfillment")}</legend>
						<div className="mt-4 grid grid-cols-2 gap-3">
							<button
								type="button"
								onClick={() => {
									setOrderType("pickup");
									setSelectedZoneId("");
								}}
								className={`flex flex-col items-center gap-1 rounded-xl border-2 px-4 py-5 text-center transition-colors ${
									orderType === "pickup"
										? "border-[#3d5a3a] bg-[#3d5a3a] text-white"
										: "border-black/10 bg-white text-ink hover:bg-black/5"
								}`}
							>
								<span className="text-sm font-semibold">{t("pickup")}</span>
								<span className="text-xs opacity-60">{t("pickupDesc")}</span>
							</button>
							<button
								type="button"
								onClick={() => setOrderType("delivery")}
								className={`flex flex-col items-center gap-1 rounded-xl border-2 px-4 py-5 text-center transition-colors ${
									orderType === "delivery"
										? "border-[#3d5a3a] bg-[#3d5a3a] text-white"
										: "border-black/10 bg-white text-ink hover:bg-black/5"
								}`}
							>
								<span className="text-sm font-semibold">{t("delivery")}</span>
								<span className="text-xs opacity-60">{t("deliveryDesc")}</span>
							</button>
						</div>

						{/* Delivery zone dropdown */}
						{orderType === "delivery" && (
							<div className="mt-4">
								<label htmlFor="ck-zone" className="sr-only">
									{t("deliveryZone")}
								</label>
								<select
									id="ck-zone"
									required
									value={selectedZoneId}
									onChange={(e) => setSelectedZoneId(e.target.value)}
									className="w-full rounded-xl border border-rule bg-paper-2 px-4 py-3 text-sm text-ink focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
								>
									<option value="">{t("selectZone")}</option>
									{zones.map((z) => (
										<option key={z.id} value={z.id}>
											{z.name} — {formatUsd(z.feeUsd)} · {t("eta", { minutes: z.etaMinutes })}
										</option>
									))}
								</select>

								{selectedZone && (
									<p className="caps mt-2 text-ink-soft/60">
										{t("minOrder", { min: Number(selectedZone.minOrderUsd).toFixed(2) })} ·{" "}
										{t("eta", { minutes: selectedZone.etaMinutes })}
									</p>
								)}
							</div>
						)}
					</fieldset>

					{/* ── Section 3: Payment ─────────────────── */}
					<fieldset>
						<legend className="caps text-ink-soft">{t("payment")}</legend>
						<div className="mt-4 grid grid-cols-3 gap-3">
							{(
								[
									{ value: "cash_usd", label: t("cashUsd"), disabled: false },
									{ value: "cash_lbp", label: t("cashLbp"), disabled: false },
									{ value: "card", label: t("card"), disabled: true },
								] as const
							).map((opt) => (
								<button
									key={opt.value}
									type="button"
									disabled={opt.disabled}
									onClick={() => {
										if (!opt.disabled) setPaymentMethod(opt.value);
									}}
									className={`relative flex flex-col items-center gap-1 rounded-xl border-2 px-3 py-4 text-center transition-colors ${
										opt.disabled
											? "cursor-not-allowed border-rule bg-paper-2 text-ink-soft/30"
											: paymentMethod === opt.value
												? "border-[#3d5a3a] bg-[#3d5a3a] text-white"
												: "border-black/10 bg-white text-ink hover:bg-black/5"
									}`}
								>
									<span className="text-xs font-semibold">{opt.label}</span>
									{opt.disabled && (
										<span
											className="caps mt-1 rounded bg-ink/5 px-2 py-0.5 text-ink-soft/50"
											style={{ fontSize: "0.6rem" }}
										>
											{t("comingSoon")}
										</span>
									)}
								</button>
							))}
						</div>
					</fieldset>

					{/* ── Section 4: Notes ───────────────────── */}
					<fieldset>
						<legend className="caps text-ink-soft">{t("notes")}</legend>
						<div className="relative mt-4">
							<label htmlFor="ck-notes" className="sr-only">
								{t("notes")}
							</label>
							<textarea
								id="ck-notes"
								maxLength={280}
								rows={3}
								placeholder={t("notesPlaceholder")}
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								className="w-full resize-none rounded-xl border border-rule bg-paper-2 px-4 py-3 text-sm text-ink placeholder:text-ink-soft/40 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
							/>
							<span className="caps absolute bottom-3 right-4 text-ink-soft/40">
								{t("charCount", { count: notes.length })}
							</span>
						</div>
					</fieldset>
				</div>

				{/* ════════════════ RIGHT — STICKY SUMMARY ════════════════ */}
				<aside className="lg:col-span-5">
					<div className="sticky top-24 rounded-2xl border border-rule bg-paper-2 p-6">
						<p className="caps text-ink-soft">{t("summary")}</p>

						{/* Line items */}
						<div className="mt-4 space-y-3">
							{items.map((item) => {
								const key = modKey(item);
								const base = Number(item.basePriceUsd);
								const modsExtra = item.modifiers.reduce((s, m) => s + Number(m.extraUsd), 0);
								const lineTotal = (base + modsExtra) * item.qty;

								return (
									<div key={key} className="flex items-start justify-between gap-3">
										<div className="flex-1">
											<p className="text-sm font-semibold text-ink">
												{item.qty} &times; {item.name}
											</p>
											{item.modifiers.length > 0 && (
												<p className="caps mt-0.5 text-ink-soft/60">
													{item.modifiers.map((m) => m.name).join(", ")}
												</p>
											)}
										</div>
										<span className="num text-sm font-semibold text-ink">
											{formatUsd(lineTotal)}
										</span>
									</div>
								);
							})}
						</div>

						{/* Totals */}
						<div className="mt-6 space-y-2 border-t border-rule pt-4">
							<div className="flex justify-between text-sm text-ink-soft">
								<span>{t("subtotal")}</span>
								<span className="num">{formatUsd(subtotalUsd)}</span>
							</div>
							<div className="flex justify-between text-sm text-ink-soft">
								<span>{t("vat")}</span>
								<span className="num">{formatUsd(vatUsd)}</span>
							</div>
							{orderType === "delivery" && deliveryFeeUsd > 0 && (
								<div className="flex justify-between text-sm text-ink-soft">
									<span>{t("deliveryFee")}</span>
									<span className="num">{formatUsd(deliveryFeeUsd)}</span>
								</div>
							)}
						</div>

						{/* Grand total */}
						<div className="mt-4 flex items-end justify-between border-t border-rule pt-4">
							<span className="font-display text-lg text-ink">{t("total")}</span>
							<div className="text-right">
								<span className="font-display text-2xl text-ink">{formatUsd(totalUsd)}</span>
								<span className="num block text-xs text-ink-soft">{formatLbp(totalUsd)}</span>
							</div>
						</div>

						{/* API down message */}
						{apiDown && (
							<div className="mt-4 rounded-lg border border-[#3d5a3a]/30 bg-[#3d5a3a]/5 px-4 py-3 text-sm text-ink">
								Ordering is temporarily unavailable. Please try again or call us at{" "}
								<a href="tel:+9613286626" className="font-semibold underline">
									+961 3 286 626
								</a>
							</div>
						)}

						{/* Error */}
						{error && (
							<p className="mt-4 rounded-lg border border-ink bg-ink/5 px-4 py-2 text-sm text-ink">
								{error}
							</p>
						)}

						{/* CTA */}
						<button
							type="submit"
							disabled={!formValid || submitting || apiDown}
							className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#3d5a3a] py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
						>
							{submitting && (
								<svg
									aria-hidden="true"
									className="h-4 w-4 animate-spin"
									viewBox="0 0 24 24"
									fill="none"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									/>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
									/>
								</svg>
							)}
							{submitting ? t("placing") : t("placeOrder")}
						</button>

						{/* WhatsApp */}
						<a
							href="https://wa.me/9611000000"
							target="_blank"
							rel="noopener noreferrer"
							className="mt-3 block text-center text-xs text-ink underline underline-offset-2 hover:opacity-70"
						>
							{t("whatsapp")}
						</a>
					</div>
				</aside>
			</form>
		</section>
	);
}
