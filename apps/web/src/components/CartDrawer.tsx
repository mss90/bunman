"use client";

import { Link } from "@/i18n/navigation";
import { modKey, useCartStore } from "@/lib/cartStore";
import { formatLbp, formatUsd } from "@/lib/formatPrice";
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
				<div className="flex flex-1 flex-col items-center justify-center gap-4 px-5">
					<p className="text-lg text-black/50">{t("empty")}</p>
					<Link
						href="/menu"
						onClick={onClose}
						className="text-sm text-black underline hover:no-underline"
					>
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
								<div key={key} className="border-b border-black/10 py-4">
									<div className="flex items-start justify-between gap-3">
										<div className="flex-1">
											<p className="font-semibold text-black">{item.name}</p>
											{item.modifiers.length > 0 && (
												<p className="mt-0.5 text-xs text-black/50">
													{item.modifiers.map((m) => m.name).join(", ")}
												</p>
											)}
										</div>
										<p className="font-semibold text-black">{formatUsd(lineTotal)}</p>
									</div>
									<div className="mt-3 flex items-center gap-3">
										<div className="flex items-center rounded-full border border-black/20">
											<button
												type="button"
												className="px-3 py-1 text-sm text-black/50 hover:text-black"
												onClick={() => updateQty(item.menuItemId, key, item.qty - 1)}
											>
												&minus;
											</button>
											<span className="w-8 text-center text-sm font-semibold text-black">
												{item.qty}
											</span>
											<button
												type="button"
												className="px-3 py-1 text-sm text-black/50 hover:text-black"
												onClick={() => updateQty(item.menuItemId, key, item.qty + 1)}
											>
												+
											</button>
										</div>
										<button
											type="button"
											className="text-xs text-black/50 underline hover:text-black"
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
					<div className="border-t border-black/10 bg-white px-5 py-4">
						<div className="flex justify-between text-sm text-black/60">
							<span>Subtotal</span>
							<span>{formatUsd(subtotal)}</span>
						</div>
						<div className="mt-1 flex justify-between text-sm text-black/60">
							<span>VAT (11%)</span>
							<span>{formatUsd(vat)}</span>
						</div>
						<div className="mt-2 flex justify-between border-t border-black/10 pt-2">
							<span className="text-lg font-semibold text-black">Total</span>
							<div className="text-right">
								<span className="text-lg font-semibold text-black">{formatUsd(total)}</span>
								<span className="block text-xs text-black/50">{formatLbp(total)}</span>
							</div>
						</div>
						<Link
							href="/checkout"
							onClick={onClose}
							className="mt-4 block w-full bg-black py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-black/80"
						>
							{t("checkout")}
						</Link>
						<button
							type="button"
							onClick={clear}
							className="mt-2 w-full text-center text-xs text-black/50 underline hover:text-black"
						>
							{t("clearBag")}
						</button>
					</div>
				</div>
			)}
		</Drawer>
	);
}
