"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartModifier {
	id: string;
	name: string;
	extraUsd: string;
}

export interface CartItem {
	menuItemId: string;
	name: string;
	slug: string;
	basePriceUsd: string;
	qty: number;
	modifiers: CartModifier[];
	photoUrl: string | null;
}

interface CartState {
	items: CartItem[];
	add: (item: CartItem) => void;
	remove: (menuItemId: string, modifierKey: string) => void;
	updateQty: (menuItemId: string, modifierKey: string, qty: number) => void;
	clear: () => void;
	totalItems: () => number;
	subtotalUsd: () => number;
}

function modKey(item: CartItem): string {
	return `${item.menuItemId}:${item.modifiers
		.map((m) => m.id)
		.sort()
		.join(",")}`;
}

export const useCartStore = create<CartState>()(
	persist(
		(set, get) => ({
			items: [],

			add: (item) =>
				set((state) => {
					const key = modKey(item);
					const existing = state.items.find((i) => modKey(i) === key);
					if (existing) {
						return {
							items: state.items.map((i) =>
								modKey(i) === key ? { ...i, qty: i.qty + item.qty } : i,
							),
						};
					}
					return { items: [...state.items, item] };
				}),

			remove: (menuItemId, modifierKey) =>
				set((state) => ({
					items: state.items.filter(
						(i) => !(i.menuItemId === menuItemId && modKey(i) === modifierKey),
					),
				})),

			updateQty: (menuItemId, modifierKey, qty) =>
				set((state) => {
					if (qty <= 0) {
						return {
							items: state.items.filter(
								(i) => !(i.menuItemId === menuItemId && modKey(i) === modifierKey),
							),
						};
					}
					return {
						items: state.items.map((i) =>
							i.menuItemId === menuItemId && modKey(i) === modifierKey ? { ...i, qty } : i,
						),
					};
				}),

			clear: () => set({ items: [] }),

			totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),

			subtotalUsd: () =>
				get().items.reduce((sum, item) => {
					const base = Number(item.basePriceUsd);
					const mods = item.modifiers.reduce((ms, m) => ms + Number(m.extraUsd), 0);
					return sum + (base + mods) * item.qty;
				}, 0),
		}),
		{
			name: "bunman-cart",
		},
	),
);

export { modKey };
