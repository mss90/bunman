"use client";

import { Link } from "@/i18n/navigation";
import { modKey, useCartStore } from "@/lib/cartStore";
import { formatLbp, formatUsd } from "@/lib/formatPrice";
import { Bunman } from "@bunman/mascot";
import { Drawer } from "@bunman/ui";
import { useTranslations } from "next-intl";

interface CartDrawerProps {
	open: boolean;
	onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
	const t = useTranslations("cart");
	const items = useCartStore((s) => s.items);
	const updateQty = useCartStore((s) => s.updateQty);
	const remove = useCartStore((s) => s.remove);
	const clear = useCartStore((s) => s.clear);
	const subtotal = useCartStore((s) => s.subtotalUsd());

	const vat = subtotal * 0.11;
	const total = subtotal + vat;

	return (
		<Drawer open={open} onClose={onClose} title={t("title")}>
			{items.length === 0 ? (
				<div className="flex flex-col items-center justify-center gap-4 px-5 py-16">
					<Bunman pose="empty" size={140} />
					<p className="caps text-ink-soft">{t("empty")}</p>
					<Link href="/menu" onClick={onClose} className="caps text-meat hover:text-meat-deep">
						{t("goGrabOne")}
					</Link>
				</div>
			) : (
				<div className="flex h-full flex-col">
					<div className="flex-1 overflow-y-auto px-5 py-4">
						{items.map((item) => {
							const key = modKey(item);
							const base = Number(item.basePriceUsd);
							const modsTotal = item.modifiers.reduce((s, m) => s + Number(m.extraUsd), 0);
							const lineTotal = (base + modsTotal) * item.qty;

							return (
								<div key={key} className="border-b border-rule py-4">
									<div className="flex items-start justify-between gap-3">
										<div className="flex-1">
											<p className="font-semibold text-ink">{item.name}</p>
											{item.modifiers.length > 0 && (
												<p className="caps mt-0.5 text-ink-soft/60">
													{item.modifiers.map((m) => m.name).join(", ")}
												</p>
											)}
										</div>
										<p className="num font-semibold text-ink">{formatUsd(lineTotal)}</p>
									</div>
									<div className="mt-3 flex items-center gap-3">
										<div className="flex items-center rounded-full border border-rule">
											<button
												type="button"
												className="px-3 py-1 text-sm text-ink-soft hover:text-ink"
												onClick={() => updateQty(item.menuItemId, key, item.qty - 1)}
											>
												−
											</button>
											<span className="num w-8 text-center text-sm font-semibold">{item.qty}</span>
											<button
												type="button"
												className="px-3 py-1 text-sm text-ink-soft hover:text-ink"
												onClick={() => updateQty(item.menuItemId, key, item.qty + 1)}
											>
												+
											</button>
										</div>
										<button
											type="button"
											className="text-xs text-meat hover:text-meat-deep"
											onClick={() => remove(item.menuItemId, key)}
										>
											Remove
										</button>
									</div>
								</div>
							);
						})}
					</div>

					{/* Totals + CTA */}
					<div className="border-t border-rule bg-paper px-5 py-4">
						<div className="flex justify-between text-sm text-ink-soft">
							<span>Subtotal</span>
							<span className="num">{formatUsd(subtotal)}</span>
						</div>
						<div className="mt-1 flex justify-between text-sm text-ink-soft">
							<span>VAT (11%)</span>
							<span className="num">{formatUsd(vat)}</span>
						</div>
						<div className="mt-2 flex justify-between border-t border-rule pt-2">
							<span className="font-display text-lg text-ink">Total</span>
							<div className="text-right">
								<span className="font-display text-lg text-meat">{formatUsd(total)}</span>
								<span className="num block text-xs text-ink-soft">{formatLbp(total)}</span>
							</div>
						</div>
						<Link
							href="/checkout"
							onClick={onClose}
							className="mt-4 block w-full rounded-full bg-meat py-3.5 text-center text-sm font-semibold text-paper transition-colors hover:bg-meat-deep"
						>
							{t("checkout")}
						</Link>
						<button
							type="button"
							onClick={clear}
							className="mt-2 w-full text-center text-xs text-meat hover:text-meat-deep"
						>
							{t("clearBag")}
						</button>
					</div>
				</div>
			)}
		</Drawer>
	);
}
