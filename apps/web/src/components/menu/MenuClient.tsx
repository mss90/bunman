"use client";

import { useCartStore } from "@/lib/cartStore";
import { formatLbp, formatUsd } from "@/lib/formatPrice";
import { useTranslations } from "next-intl";
import { useCallback, useRef, useState } from "react";
import { ModifierDrawer } from "./ModifierDrawer";

/* ------------------------------------------------------------------ */
/*  Types (mirrors the server component's exports)                     */
/* ------------------------------------------------------------------ */

interface Modifier {
	id: string;
	name: string;
	extraUsd: string;
	extraLbp: number;
	isDefault: boolean;
}

interface ModifierGroup {
	id: string;
	slug: string;
	name: string;
	minSelect: number;
	maxSelect: number;
	isRequired: boolean;
	modifiers: Modifier[];
}

export interface MenuItem {
	id: string;
	categoryId: string;
	slug: string;
	name: string;
	description: string;
	basePriceUsd: string;
	basePriceLbp: number;
	isAvailable: boolean;
	isVisible: boolean;
	photoUrl: string | null;
	displayOrder: number;
	isVegetarian: boolean;
	modifierGroups: ModifierGroup[];
}

export interface Category {
	id: string;
	slug: string;
	name: string;
	displayOrder: number;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface MenuClientProps {
	categories: Category[];
	items: MenuItem[];
}

export function MenuClient({ categories, items }: MenuClientProps) {
	const t = useTranslations("menu");
	const add = useCartStore((s) => s.add);

	const [mode, setMode] = useState<"pickup" | "delivery">("pickup");
	const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id ?? "");
	const [drawerItem, setDrawerItem] = useState<MenuItem | null>(null);

	/* refs for scroll-into-view */
	const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

	const scrollTo = useCallback((catId: string) => {
		setActiveCategory(catId);
		const el = sectionRefs.current[catId];
		if (el) {
			/* offset for sticky header + chip bar */
			const y = el.getBoundingClientRect().top + window.scrollY - 140;
			window.scrollTo({ top: y, behavior: "smooth" });
		}
	}, []);

	/* quick-add: qty 1 + default modifiers only */
	const quickAdd = useCallback(
		(item: MenuItem) => {
			const defaultMods = item.modifierGroups.flatMap((g) =>
				g.modifiers
					.filter((m) => m.isDefault)
					.map((m) => ({ id: m.id, name: m.name, extraUsd: m.extraUsd })),
			);
			add({
				menuItemId: item.id,
				name: item.name,
				slug: item.slug,
				basePriceUsd: item.basePriceUsd,
				qty: 1,
				modifiers: defaultMods,
				photoUrl: item.photoUrl,
			});
		},
		[add],
	);

	/* items grouped by category (preserving display order) */
	const grouped = categories
		.map((cat) => ({
			category: cat,
			items: items
				.filter((i) => i.categoryId === cat.id)
				.sort((a, b) => a.displayOrder - b.displayOrder),
		}))
		.filter((g) => g.items.length > 0);

	return (
		<>
			{/* ---- Hero band ---- */}
			<section className="mx-auto max-w-7xl px-5 pt-16 pb-8">
				<p className="caps text-ink-soft">{t("eyebrow")}</p>
				<h1 className="font-display mt-2 text-5xl text-ink md:text-7xl">{t("headline")}</h1>

				{/* Pickup / Delivery toggle */}
				<div className="mt-8 inline-flex rounded-full border-2 border-ink p-1">
					<button
						type="button"
						onClick={() => setMode("pickup")}
						className={`rounded-full px-6 py-2 text-sm font-semibold transition-colors duration-[var(--dur-fast)] ${
							mode === "pickup" ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
						}`}
					>
						{t("pickup")}
					</button>
					<button
						type="button"
						onClick={() => setMode("delivery")}
						className={`rounded-full px-6 py-2 text-sm font-semibold transition-colors duration-[var(--dur-fast)] ${
							mode === "delivery" ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
						}`}
					>
						{t("delivery")}
					</button>
				</div>
			</section>

			{/* ---- Category chips (sticky) ---- */}
			<div className="sticky top-16 z-40 border-b border-rule bg-paper/95 backdrop-blur-sm">
				<nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 py-3 scrollbar-none">
					{grouped.map(({ category }) => (
						<button
							key={category.id}
							type="button"
							onClick={() => scrollTo(category.id)}
							className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors duration-[var(--dur-fast)] ${
								activeCategory === category.id
									? "border-ink bg-ink text-paper"
									: "border-ink bg-paper text-ink hover:bg-ink/5"
							}`}
						>
							{category.name}
						</button>
					))}
				</nav>
			</div>

			{/* ---- Menu sections ---- */}
			<section className="mx-auto max-w-7xl px-5 pb-24">
				{grouped.map(({ category, items: catItems }) => (
					<div
						key={category.id}
						ref={(el) => {
							sectionRefs.current[category.id] = el;
						}}
						className="pt-10"
					>
						<h2 className="font-display text-3xl uppercase text-ink">{category.name}</h2>
						<div className="mt-3 border-b border-ink" />

						<div className="mt-4 divide-y divide-rule">
							{catItems.map((item) => (
								<MenuItemRow
									key={item.id}
									item={item}
									onQuickAdd={quickAdd}
									onCustomize={setDrawerItem}
									t={t}
								/>
							))}
						</div>
					</div>
				))}
			</section>

			{/* ---- Modifier drawer ---- */}
			<ModifierDrawer item={drawerItem} onClose={() => setDrawerItem(null)} />
		</>
	);
}

/* ------------------------------------------------------------------ */
/*  Menu item row                                                      */
/* ------------------------------------------------------------------ */

function MenuItemRow({
	item,
	onQuickAdd,
	onCustomize,
	t,
}: {
	item: MenuItem;
	onQuickAdd: (item: MenuItem) => void;
	onCustomize: (item: MenuItem) => void;
	t: ReturnType<typeof useTranslations<"menu">>;
}) {
	const soldOut = !item.isAvailable;
	const hasModifiers = item.modifierGroups.length > 0;

	return (
		<div
			className={`flex items-start gap-4 rounded-lg border border-rule bg-white p-4 my-2 ${soldOut ? "opacity-50" : ""}`}
		>
			{/* Left: name + description */}
			<div className="min-w-0 flex-1">
				<div className="flex items-center gap-2">
					<span className="font-display text-lg text-ink">{item.name}</span>
					{soldOut && <span className="text-xs font-semibold text-ink-soft">{t("soldOut")}</span>}
				</div>
				{item.description && (
					<p className="mt-0.5 text-sm text-ink-soft line-clamp-2">{item.description}</p>
				)}

				{/* Action buttons */}
				<div className="mt-2 flex items-center gap-3">
					<button
						type="button"
						disabled={soldOut}
						onClick={() => onQuickAdd(item)}
						className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink text-paper transition-opacity duration-[var(--dur-fast)] hover:opacity-80 disabled:pointer-events-none disabled:opacity-40"
						aria-label={t("quickAdd")}
					>
						<PlusIcon />
					</button>
					{hasModifiers && (
						<button
							type="button"
							disabled={soldOut}
							onClick={() => onCustomize(item)}
							className="text-sm font-semibold text-ink underline underline-offset-2 transition-opacity duration-[var(--dur-fast)] hover:opacity-70 disabled:pointer-events-none disabled:opacity-40"
						>
							{t("customize")}
						</button>
					)}
				</div>
			</div>

			{/* Right: price */}
			<div className="shrink-0 text-right">
				<span className="num font-bold text-ink">{formatUsd(item.basePriceUsd)}</span>
				<span className="num mt-0.5 block text-xs text-ink-soft">
					{formatLbp(item.basePriceUsd)}
				</span>
			</div>
		</div>
	);
}

/* ------------------------------------------------------------------ */
/*  Tiny plus icon                                                     */
/* ------------------------------------------------------------------ */

function PlusIcon() {
	return (
		<svg
			width="14"
			height="14"
			viewBox="0 0 14 14"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			aria-hidden="true"
		>
			<path d="M7 2v10M2 7h10" />
		</svg>
	);
}
