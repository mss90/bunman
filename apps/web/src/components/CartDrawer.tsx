"use client";

import { Link } from "@/i18n/navigation";
import { modKey, useCartStore } from "@/lib/cartStore";
import { formatUsd } from "@/lib/formatPrice";
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

	return (
		<Drawer open={open} onClose={onClose} title={t("title")}>
			{items.length === 0 ? (
				/* ---- Empty state ---- */
				<div className="flex flex-1 flex-col items-center justify-center gap-5 px-6">
					{/* Bag icon */}
					<div className="flex h-20 w-20 items-center justify-center rounded-full bg-black/5">
						<svg
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							width="36"
							height="36"
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
					<div className="text-center">
						<p className="text-lg font-semibold text-black">{t("empty")}</p>
						<p className="mt-1 text-sm text-black/40">Add items from the menu to get started</p>
					</div>
					<Link
						href="/menu"
						onClick={onClose}
						className="mt-2 inline-block rounded-full bg-black px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-black/80"
					>
						Browse menu
					</Link>
				</div>
			) : (
				/* ---- Items state ---- */
				<div className="flex h-full flex-col">
					{/* Scrollable items list */}
					<div className="flex-1 overflow-y-auto px-5 py-3">
						{items.map((item) => {
							const key = modKey(item);
							const base = Number(item.basePriceUsd);
							const modsTotal = item.modifiers.reduce((s, m) => s + Number(m.extraUsd), 0);
							const lineTotal = (base + modsTotal) * item.qty;

							return (
								<div key={key} className="border-b border-black/[0.06] py-4 last:border-b-0">
									{/* Top row: name + price */}
									<div className="flex items-start justify-between gap-3">
										<div className="flex-1">
											<p className="font-semibold text-black">{item.name}</p>
											{item.modifiers.length > 0 && (
												<p className="mt-0.5 text-xs text-black/50">
													{item.modifiers.map((m) => m.name).join(", ")}
												</p>
											)}
										</div>
										<p className="text-sm font-semibold text-black">{formatUsd(lineTotal)}</p>
									</div>

									{/* Bottom row: qty stepper + trash */}
									<div className="mt-3 flex items-center justify-between">
										<div className="flex items-center rounded-full border border-black/15">
											<button
												type="button"
												className="flex h-8 w-8 items-center justify-center text-sm text-black/50 transition-colors hover:text-black"
												onClick={() => updateQty(item.menuItemId, key, item.qty - 1)}
												aria-label="Decrease quantity"
											>
												&minus;
											</button>
											<span className="w-8 text-center text-sm font-semibold text-black">
												{item.qty}
											</span>
											<button
												type="button"
												className="flex h-8 w-8 items-center justify-center text-sm text-black/50 transition-colors hover:text-black"
												onClick={() => updateQty(item.menuItemId, key, item.qty + 1)}
												aria-label="Increase quantity"
											>
												+
											</button>
										</div>

										{/* Trash icon button */}
										<button
											type="button"
											className="flex h-8 w-8 items-center justify-center rounded-full text-black/30 transition-colors hover:bg-red-50 hover:text-red-500"
											onClick={() => remove(item.menuItemId, key)}
											aria-label={`Remove ${item.name}`}
										>
											<svg
												aria-hidden="true"
												xmlns="http://www.w3.org/2000/svg"
												width="16"
												height="16"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<polyline points="3 6 5 6 21 6" />
												<path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
												<line x1="10" y1="11" x2="10" y2="17" />
												<line x1="14" y1="11" x2="14" y2="17" />
											</svg>
										</button>
									</div>
								</div>
							);
						})}
					</div>

					{/* Bottom sticky area */}
					<div className="border-t border-black/10 bg-white px-5 pb-6 pt-4">
						{/* Subtotal */}
						<div className="flex items-center justify-between">
							<span className="text-sm text-black/60">Subtotal</span>
							<span className="text-sm font-medium text-black">{formatUsd(subtotal)}</span>
						</div>
						<p className="mt-1 text-xs text-black/40">View full summary at checkout</p>

						{/* Checkout button */}
						<Link
							href="/checkout"
							onClick={onClose}
							className="mt-4 block w-full rounded-xl bg-black py-4 text-center text-sm font-semibold text-white transition-colors hover:bg-black/85"
						>
							{t("checkout")}
						</Link>

						{/* Clear bag */}
						<button
							type="button"
							onClick={clear}
							className="mt-3 w-full text-center text-xs text-black/40 transition-colors hover:text-black/70"
						>
							{t("clearBag")}
						</button>
					</div>
				</div>
			)}
		</Drawer>
	);
}
