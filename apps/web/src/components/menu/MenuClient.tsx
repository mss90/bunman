"use client";

import { useCartStore } from "@/lib/cartStore";
import { formatLbp, formatUsd } from "@/lib/formatPrice";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { ModifierDrawer } from "./ModifierDrawer";

/* ------------------------------------------------------------------ */
/*  Photo map: slug -> local image path                                */
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
	const chipRefs = useRef<Record<string, HTMLButtonElement | null>>({});

	const scrollTo = useCallback((catId: string) => {
		setActiveCategory(catId);
		const el = sectionRefs.current[catId];
		if (el) {
			/* offset for sticky header + chip bar */
			const y = el.getBoundingClientRect().top + window.scrollY - 140;
			window.scrollTo({ top: y, behavior: "smooth" });
		}
		/* scroll the chip into view */
		const chip = chipRefs.current[catId];
		if (chip) {
			chip.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
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
		<div className="bg-[#FFF8EC]">
			{/* ---- Hero area ---- */}
			<section className="mx-auto max-w-2xl px-5 pt-16 pb-6 text-center">
				<h1 className="font-display text-4xl uppercase tracking-wide text-[#0d0d0d]">MENU</h1>

				{/* Pickup / Delivery segmented control */}
				<div className="mt-6 flex justify-center">
					<div className="relative inline-flex rounded-full bg-[#F5ECD6] p-1">
						{/* Sliding pill */}
						<div
							className="absolute top-1 bottom-1 rounded-full bg-[#0d0d0d] transition-all duration-300 ease-in-out"
							style={{
								width: "calc(50% - 4px)",
								left: mode === "pickup" ? "4px" : "calc(50% + 0px)",
							}}
						/>
						<button
							type="button"
							onClick={() => setMode("pickup")}
							className={`relative z-10 rounded-full px-8 py-2.5 text-sm font-semibold transition-colors duration-300 ${
								mode === "pickup" ? "text-[#FFF8EC]" : "text-[#0d0d0d]/60"
							}`}
						>
							{t("pickup")}
						</button>
						<button
							type="button"
							onClick={() => setMode("delivery")}
							className={`relative z-10 rounded-full px-8 py-2.5 text-sm font-semibold transition-colors duration-300 ${
								mode === "delivery" ? "text-[#FFF8EC]" : "text-[#0d0d0d]/60"
							}`}
						>
							{t("delivery")}
						</button>
					</div>
				</div>
			</section>

			{/* ---- Category chips (sticky) ---- */}
			<div className="sticky top-16 z-40 bg-[#FFF8EC]/95 backdrop-blur-sm">
				<nav className="mx-auto flex max-w-2xl gap-2 overflow-x-auto px-5 py-3 scrollbar-none">
					{grouped.map(({ category }) => (
						<button
							key={category.id}
							ref={(el) => {
								chipRefs.current[category.id] = el;
							}}
							type="button"
							onClick={() => scrollTo(category.id)}
							className={`shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${
								activeCategory === category.id
									? "bg-[#0d0d0d] text-[#FFF8EC]"
									: "border border-[#0d0d0d]/15 bg-transparent text-[#0d0d0d]"
							}`}
						>
							{category.name}
						</button>
					))}
				</nav>
				<div className="mx-auto max-w-2xl border-b border-[#0d0d0d]/5" />
			</div>

			{/* ---- Menu sections ---- */}
			<section className="mx-auto max-w-2xl px-5 pb-24">
				{grouped.map(({ category, items: catItems }) => (
					<div
						key={category.id}
						ref={(el) => {
							sectionRefs.current[category.id] = el;
						}}
						className="pt-10"
					>
						<h2 className="font-display text-xl uppercase tracking-wide text-[#0d0d0d]">
							{category.name}
						</h2>
						<div className="mt-2 border-b border-[#0d0d0d]/10" />

						<div className="mt-1">
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
		</div>
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
	const photo = photoMap[item.slug] ?? null;

	return (
		<div
			className={`flex items-start gap-4 border-b border-[#0d0d0d]/5 py-4 ${soldOut ? "opacity-40" : ""}`}
		>
			{/* Left side: text content */}
			<div className="min-w-0 flex-1">
				<div className="flex items-center gap-2">
					<span className="text-base font-semibold text-[#0d0d0d]">{item.name}</span>
					{soldOut && (
						<span className="rounded-full bg-[#0d0d0d]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0d0d0d]/50">
							Unavailable
						</span>
					)}
				</div>
				{item.description && (
					<p className="mt-1 text-sm leading-snug text-[#0d0d0d]/50 line-clamp-2">
						{item.description}
					</p>
				)}

				{/* Price */}
				<p className="mt-1 text-sm font-semibold text-[#0d0d0d]">
					{formatUsd(item.basePriceUsd)}
					<span className="num ml-1.5 font-normal text-[#0d0d0d]/40 text-xs">
						{formatLbp(item.basePriceUsd)}
					</span>
				</p>

				{/* Action buttons */}
				<div className="mt-2.5 flex items-center gap-3">
					<button
						type="button"
						disabled={soldOut}
						onClick={() => onQuickAdd(item)}
						className="rounded-full bg-[#0d0d0d] px-4 py-1.5 text-xs font-semibold text-[#FFF8EC] transition-opacity duration-200 hover:opacity-80 disabled:pointer-events-none disabled:opacity-40"
					>
						Add
					</button>
					{hasModifiers && (
						<button
							type="button"
							disabled={soldOut}
							onClick={() => onCustomize(item)}
							className="text-xs font-semibold text-[#0d0d0d]/60 underline underline-offset-2 transition-opacity duration-200 hover:opacity-70 disabled:pointer-events-none disabled:opacity-40"
						>
							{t("customize")}
						</button>
					)}
				</div>
			</div>

			{/* Right side: product photo */}
			{photo && (
				<div
					className={`relative shrink-0 h-[90px] w-[90px] overflow-hidden rounded-xl bg-[#F5ECD6] ${soldOut ? "grayscale" : ""}`}
				>
					<Image
						src={photo}
						alt={item.name}
						width={90}
						height={90}
						className="h-full w-full object-contain p-1"
					/>
				</div>
			)}
		</div>
	);
}
