"use client";

import { useCartStore } from "@/lib/cartStore";
import { formatUsd } from "@/lib/formatPrice";
import { useToastStore } from "@/lib/toastStore";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { MenuItem } from "./MenuClient";

/* ------------------------------------------------------------------ */
/*  Photo map (same as MenuClient)                                     */
/* ------------------------------------------------------------------ */

const photoMap: Record<string, string> = {
	"bunman-cheeseburger": "/menu/bunman-single.png",
	"classic-cheeseburger": "/menu/classic-single.png",
	"big-man": "/menu/big-man.png",
	"double-bunman": "/menu/bunman-double.png",
	"double-classic": "/menu/classic-double.png",
	fries: "/menu/fries.png",
	"chocolate-milkshake": "/menu/chocolate-milkshake.png",
	"vanilla-milkshake": "/menu/vanilla-milkshake.png",
};

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ModifierSelections = Record<string, boolean>;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface ItemDetailModalProps {
	item: MenuItem | null;
	onClose: () => void;
}

export function ItemDetailModal({ item, onClose }: ItemDetailModalProps) {
	const add = useCartStore((s) => s.add);
	const showToast = useToastStore((s) => s.show);

	const [visible, setVisible] = useState(false);
	const [animateIn, setAnimateIn] = useState(false);
	const [qty, setQty] = useState(1);
	const [selections, setSelections] = useState<ModifierSelections>({});
	const [specialInstructions, setSpecialInstructions] = useState("");

	/* Mount/unmount animation */
	useEffect(() => {
		if (item) {
			setVisible(true);
			const raf = requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					setAnimateIn(true);
				});
			});
			return () => cancelAnimationFrame(raf);
		}
		setAnimateIn(false);
		const timer = setTimeout(() => setVisible(false), 300);
		return () => clearTimeout(timer);
	}, [item]);

	/* Reset state when a new item opens */
	useEffect(() => {
		if (item) {
			setQty(1);
			setSpecialInstructions("");
			const defaults: ModifierSelections = {};
			for (const g of item.modifierGroups) {
				for (const m of g.modifiers) {
					if (m.isDefault) defaults[m.id] = true;
				}
			}
			setSelections(defaults);
		}
	}, [item]);

	/* Lock body scroll when open */
	useEffect(() => {
		if (item) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [item]);

	/* Close on Escape */
	useEffect(() => {
		if (!item) return;
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handleEsc);
		return () => window.removeEventListener("keydown", handleEsc);
	}, [item, onClose]);

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
		showToast("Added to bag");
	}, [item, selections, qty, add, onClose, showToast]);

	if (!visible) return null;

	const photo = item ? (photoMap[item.slug] ?? null) : null;

	return (
		<div className="fixed inset-0 z-[9999]">
			{/* Dark backdrop */}
			<div
				className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
					animateIn ? "opacity-100" : "opacity-0"
				}`}
				onClick={onClose}
				onKeyDown={(e) => {
					if (e.key === "Escape") onClose();
				}}
				role="presentation"
				aria-hidden="true"
			/>

			{/* Panel: bottom-sheet on mobile, centered modal on desktop */}
			{/* biome-ignore lint/a11y/useSemanticElements: dialog element causes z-index stacking issues */}
			<div
				role="dialog"
				aria-modal="true"
				aria-label={item?.name}
				className={`
          absolute inset-x-0 bottom-0 flex max-h-[92vh] flex-col bg-[#FFF8EC] rounded-t-2xl shadow-2xl
          transition-transform duration-300 ease-[cubic-bezier(0.2,0.7,0.1,1)]
          md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2
          md:max-w-lg md:w-full md:rounded-2xl md:max-h-[85vh]
          ${animateIn ? "translate-y-0 md:scale-100 md:opacity-100" : "translate-y-full md:scale-95 md:opacity-0"}
        `}
			>
				{item && (
					<>
						{/* Close button */}
						<button
							type="button"
							onClick={onClose}
							className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#0d0d0d]/10 text-[#0d0d0d]/60 transition-colors hover:bg-[#0d0d0d]/20"
							aria-label="Close"
						>
							<svg
								aria-hidden="true"
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<line x1="18" y1="6" x2="6" y2="18" />
								<line x1="6" y1="6" x2="18" y2="18" />
							</svg>
						</button>

						{/* Scrollable content */}
						<div className="flex-1 overflow-y-auto">
							{/* Product image */}
							<div className="flex h-56 w-full items-center justify-center bg-[#F5ECD6]">
								{photo ? (
									<Image
										src={photo}
										alt={item.name}
										width={200}
										height={200}
										className="h-44 w-44 object-contain"
									/>
								) : (
									<div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#0d0d0d]/5">
										<svg
											aria-hidden="true"
											width="32"
											height="32"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="1.5"
											className="text-[#0d0d0d]/20"
										>
											<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
											<circle cx="8.5" cy="8.5" r="1.5" />
											<path d="M21 15l-5-5L5 21" />
										</svg>
									</div>
								)}
							</div>

							<div className="px-5 py-5">
								{/* Name & description */}
								<h2 className="font-display text-2xl uppercase tracking-wide text-[#0d0d0d]">
									{item.name}
								</h2>
								{item.description && (
									<p className="mt-1.5 text-sm leading-relaxed text-[#0d0d0d]/50">
										{item.description}
									</p>
								)}

								{/* Price */}
								<p className="mt-3 font-display text-xl text-[#0d0d0d]">
									{formatUsd(item.basePriceUsd)}
								</p>

								{/* Modifier groups */}
								{item.modifierGroups.map((group) => (
									<div key={group.id} className="mt-6">
										<div className="flex items-baseline justify-between">
											<h3 className="text-sm font-semibold uppercase tracking-wider text-[#0d0d0d]">
												{group.name}
											</h3>
											<span className="text-xs text-[#0d0d0d]/40">
												{group.isRequired
													? "Required"
													: group.maxSelect > 1
														? `Select up to ${group.maxSelect}`
														: "Optional"}
											</span>
										</div>

										<div className="mt-3 space-y-2">
											{group.modifiers.map((mod) => {
												const isRadio = group.maxSelect === 1;
												const checked = !!selections[mod.id];
												return (
													<label
														key={mod.id}
														className={`flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3.5 transition-all duration-200 select-none ${
															checked
																? "bg-[#2C3E2D] text-white"
																: "bg-[#F5ECD6] text-[#0d0d0d] hover:bg-[#ede4c8]"
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
																isRadio ? "rounded-full" : "rounded-[5px]"
															} ${
																checked ? "border-white bg-white" : "border-black/20 bg-transparent"
															}`}
														>
															{checked && (
																<svg
																	width="12"
																	height="12"
																	viewBox="0 0 12 12"
																	fill="none"
																	stroke="#2C3E2D"
																	strokeWidth="2"
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	aria-hidden="true"
																>
																	<path d="M2.5 6l2.5 2.5 4.5-5" />
																</svg>
															)}
														</span>

														<span className="flex-1 text-sm font-medium">{mod.name}</span>
														{Number(mod.extraUsd) > 0 && (
															<span
																className={`text-sm ${checked ? "text-white/70" : "text-black/40"}`}
															>
																+{formatUsd(mod.extraUsd)}
															</span>
														)}
													</label>
												);
											})}
										</div>
									</div>
								))}

								{/* Special instructions */}
								<div className="mt-6">
									<h3 className="text-sm font-semibold uppercase tracking-wider text-[#0d0d0d]">
										Special instructions
									</h3>
									<textarea
										maxLength={150}
										rows={2}
										placeholder="Any special requests?"
										value={specialInstructions}
										onChange={(e) => setSpecialInstructions(e.target.value)}
										className="mt-3 w-full resize-none rounded-xl border border-[#0d0d0d]/10 bg-[#F5ECD6] px-4 py-3 text-sm text-[#0d0d0d] placeholder:text-[#0d0d0d]/30 focus:border-[#0d0d0d]/30 focus:outline-none focus:ring-1 focus:ring-[#0d0d0d]/20"
									/>
									<p className="mt-1 text-right text-xs text-[#0d0d0d]/30">
										{specialInstructions.length}/150
									</p>
								</div>

								{/* Quantity selector */}
								<div className="mt-4">
									<h3 className="text-sm font-semibold uppercase tracking-wider text-[#0d0d0d]">
										Quantity
									</h3>
									<div className="mt-3 inline-flex items-center rounded-full bg-[#F5ECD6]">
										<button
											type="button"
											onClick={() => setQty((q) => Math.max(1, q - 1))}
											className="flex h-11 w-11 items-center justify-center text-lg font-semibold text-[#0d0d0d] transition-opacity hover:opacity-70 disabled:opacity-30"
											disabled={qty <= 1}
										>
											&minus;
										</button>
										<span className="w-10 text-center text-sm font-semibold text-[#0d0d0d]">
											{qty}
										</span>
										<button
											type="button"
											onClick={() => setQty((q) => Math.min(10, q + 1))}
											className="flex h-11 w-11 items-center justify-center text-lg font-semibold text-[#0d0d0d] transition-opacity hover:opacity-70 disabled:opacity-30"
											disabled={qty >= 10}
										>
											+
										</button>
									</div>
								</div>
							</div>
						</div>

						{/* Sticky bottom: Add to bag button */}
						<div className="border-t border-[#0d0d0d]/5 bg-[#FFF8EC] px-5 py-4">
							<button
								type="button"
								onClick={handleAdd}
								className="w-full rounded-xl bg-[#2C3E2D] py-4 text-base font-semibold text-white transition-opacity duration-200 hover:opacity-90"
							>
								Add to bag &mdash; {formatUsd(totalUsd)}
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
