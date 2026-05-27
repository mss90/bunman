"use client";

import { useCartStore } from "@/lib/cartStore";
import { formatLbp, formatUsd } from "@/lib/formatPrice";
import { Drawer } from "@bunman/ui";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { MenuItem } from "./MenuClient";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

/** modifierId -> true */
type ModifierSelections = Record<string, boolean>;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface ModifierDrawerProps {
	item: MenuItem | null;
	onClose: () => void;
}

export function ModifierDrawer({ item, onClose }: ModifierDrawerProps) {
	const t = useTranslations("menu");
	const add = useCartStore((s) => s.add);

	const [qty, setQty] = useState(1);
	const [selections, setSelections] = useState<ModifierSelections>({});

	/* Reset state when a new item opens */
	useEffect(() => {
		if (item) {
			setQty(1);
			const defaults: ModifierSelections = {};
			for (const g of item.modifierGroups) {
				for (const m of g.modifiers) {
					if (m.isDefault) defaults[m.id] = true;
				}
			}
			setSelections(defaults);
		}
	}, [item]);

	/* Toggle a modifier */
	const toggle = useCallback(
		(groupId: string, modId: string, maxSelect: number) => {
			setSelections((prev) => {
				const next = { ...prev };

				if (maxSelect === 1) {
					/* radio: uncheck others in the same group */
					const group = item?.modifierGroups.find((g) => g.id === groupId);
					if (group) {
						for (const m of group.modifiers) {
							delete next[m.id];
						}
					}
					next[modId] = true;
				} else {
					/* checkbox */
					if (next[modId]) {
						delete next[modId];
					} else {
						/* enforce maxSelect */
						const group = item?.modifierGroups.find((g) => g.id === groupId);
						if (group) {
							const currentCount = group.modifiers.filter((m) => next[m.id]).length;
							if (currentCount >= maxSelect) return prev;
						}
						next[modId] = true;
					}
				}
				return next;
			});
		},
		[item],
	);

	/* Compute total price */
	const totalUsd = useMemo(() => {
		if (!item) return 0;
		const base = Number(item.basePriceUsd);
		let modExtra = 0;
		for (const g of item.modifierGroups) {
			for (const m of g.modifiers) {
				if (selections[m.id]) {
					modExtra += Number(m.extraUsd);
				}
			}
		}
		return (base + modExtra) * qty;
	}, [item, selections, qty]);

	/* Add to cart */
	const handleAdd = useCallback(() => {
		if (!item) return;
		const chosenModifiers = item.modifierGroups.flatMap((g) =>
			g.modifiers
				.filter((m) => selections[m.id])
				.map((m) => ({ id: m.id, name: m.name, extraUsd: m.extraUsd })),
		);
		add({
			menuItemId: item.id,
			name: item.name,
			slug: item.slug,
			basePriceUsd: item.basePriceUsd,
			qty,
			modifiers: chosenModifiers,
			photoUrl: item.photoUrl,
		});
		onClose();
	}, [item, selections, qty, add, onClose]);

	return (
		<Drawer open={!!item} onClose={onClose} title={item?.name}>
			{item && (
				<div className="flex h-full flex-col">
					{/* Scrollable body */}
					<div className="flex-1 overflow-y-auto px-5 py-4">
						{/* Item price header */}
						<div className="mb-6">
							<span className="num text-lg font-semibold text-ink">
								{formatUsd(item.basePriceUsd)}
							</span>
							<span className="num ml-2 text-sm text-ink-soft">{formatLbp(item.basePriceUsd)}</span>
						</div>

						{/* Modifier groups */}
						{item.modifierGroups.map((group) => (
							<div key={group.id} className="mb-6">
								<div className="flex items-center gap-2">
									<h3 className="caps text-ink">{group.name}</h3>
									<span className="caps text-ink-soft/60">
										{group.isRequired
											? t("required")
											: group.maxSelect > 1
												? t("selectUpTo", {
														max: group.maxSelect,
													})
												: t("optional")}
									</span>
								</div>

								<div className="mt-3 space-y-2">
									{group.modifiers.map((mod) => {
										const isRadio = group.maxSelect === 1;
										const checked = !!selections[mod.id];
										return (
											<label
												key={mod.id}
												className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 px-4 py-3 transition-colors duration-[var(--dur-fast)] select-none ${
													checked ? "border-meat bg-meat/5" : "border-rule"
												}`}
											>
												<input
													type={isRadio ? "radio" : "checkbox"}
													name={group.id}
													checked={checked}
													onChange={() => toggle(group.id, mod.id, group.maxSelect)}
													className="sr-only"
												/>
												{/* Custom indicator */}
												<span
													className={`flex h-5 w-5 shrink-0 items-center justify-center border-2 transition-colors ${
														isRadio ? "rounded-full" : "rounded-[4px]"
													} ${checked ? "border-meat bg-meat" : "border-rule"}`}
												>
													{checked && <CheckIcon />}
												</span>

												<span className="flex-1 text-sm font-medium text-ink">{mod.name}</span>
												{Number(mod.extraUsd) > 0 && (
													<span className="num text-sm text-ink-soft">
														+{formatUsd(mod.extraUsd)}
													</span>
												)}
											</label>
										);
									})}
								</div>
							</div>
						))}

						{/* Quantity stepper */}
						<div className="mt-4">
							<h3 className="caps text-ink">{t("qty")}</h3>
							<div className="mt-3 inline-flex items-center rounded-full border-2 border-rule">
								<button
									type="button"
									onClick={() => setQty((q) => Math.max(1, q - 1))}
									className="flex h-10 w-10 items-center justify-center text-lg font-semibold text-ink transition-colors hover:text-meat disabled:opacity-30"
									disabled={qty <= 1}
								>
									&minus;
								</button>
								<span className="num w-10 text-center text-sm font-semibold text-ink">{qty}</span>
								<button
									type="button"
									onClick={() => setQty((q) => Math.min(20, q + 1))}
									className="flex h-10 w-10 items-center justify-center text-lg font-semibold text-ink transition-colors hover:text-meat disabled:opacity-30"
									disabled={qty >= 20}
								>
									+
								</button>
							</div>
						</div>
					</div>

					{/* Sticky footer */}
					<div className="sticky bottom-0 border-t border-rule bg-paper px-5 py-4">
						<button
							type="button"
							onClick={handleAdd}
							className="w-full rounded-full bg-meat py-3.5 text-sm font-semibold text-paper transition-colors duration-[var(--dur-fast)] hover:bg-meat-deep"
						>
							{t("addToBun")} &middot; <span className="num">{formatUsd(totalUsd)}</span>
						</button>
					</div>
				</div>
			)}
		</Drawer>
	);
}

/* ------------------------------------------------------------------ */
/*  Tiny check icon                                                    */
/* ------------------------------------------------------------------ */

function CheckIcon() {
	return (
		<svg
			width="12"
			height="12"
			viewBox="0 0 12 12"
			fill="none"
			stroke="white"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M2.5 6l2.5 2.5 4.5-5" />
		</svg>
	);
}
