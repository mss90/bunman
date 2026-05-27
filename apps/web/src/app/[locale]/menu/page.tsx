import { MenuClient } from "@/components/menu/MenuClient";
import { api } from "@/lib/api";

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

interface Branch {
	id: string;
	name: string;
	[key: string]: unknown;
}

interface MenuResponse {
	branches: Branch[];
	categories: Category[];
	items: MenuItem[];
}

/* ------------------------------------------------------------------ */
/*  Static fallback data (used when API is down)                       */
/* ------------------------------------------------------------------ */

const STATIC_CATEGORIES: Category[] = [
	{ id: "burgers", slug: "burgers", name: "Burgers", displayOrder: 1 },
	{ id: "sides", slug: "sides", name: "Sides", displayOrder: 2 },
	{ id: "shakes", slug: "shakes", name: "Shakes", displayOrder: 3 },
];

const STATIC_ITEMS: MenuItem[] = [
	{
		id: "1",
		categoryId: "burgers",
		slug: "bunman-cheeseburger",
		name: "Bunman Cheeseburger",
		description: "Cheddar Cheese, Grilled Onions, Dill Pickles & Bunman Sauce",
		basePriceUsd: "7.50",
		basePriceLbp: 671250,
		isAvailable: true,
		isVisible: true,
		photoUrl: null,
		displayOrder: 1,
		isVegetarian: false,
		modifierGroups: [],
	},
	{
		id: "2",
		categoryId: "burgers",
		slug: "classic-cheeseburger",
		name: "Classic Cheeseburger",
		description: "Cheddar Cheese, Onions, Dill Pickles & Bunman Sauce",
		basePriceUsd: "6.50",
		basePriceLbp: 581750,
		isAvailable: true,
		isVisible: true,
		photoUrl: null,
		displayOrder: 2,
		isVegetarian: false,
		modifierGroups: [],
	},
	{
		id: "3",
		categoryId: "burgers",
		slug: "big-man",
		name: "Big Man",
		description: "Bun in the middle, Dill Pickles, Onions, Bunman Sauce, 2x Patty & 2x Cheese",
		basePriceUsd: "11.00",
		basePriceLbp: 984500,
		isAvailable: true,
		isVisible: true,
		photoUrl: null,
		displayOrder: 3,
		isVegetarian: false,
		modifierGroups: [],
	},
	{
		id: "4",
		categoryId: "burgers",
		slug: "double-bunman",
		name: "Double Bunman",
		description: "Double Bunman Cheeseburger -- same fixings, 2x patty, 2x cheese",
		basePriceUsd: "10.00",
		basePriceLbp: 895000,
		isAvailable: true,
		isVisible: true,
		photoUrl: null,
		displayOrder: 4,
		isVegetarian: false,
		modifierGroups: [],
	},
	{
		id: "5",
		categoryId: "burgers",
		slug: "double-classic",
		name: "Double Classic",
		description: "Double Classic Cheeseburger -- same fixings, 2x patty, 2x cheese",
		basePriceUsd: "9.00",
		basePriceLbp: 805500,
		isAvailable: true,
		isVisible: true,
		photoUrl: null,
		displayOrder: 5,
		isVegetarian: false,
		modifierGroups: [],
	},
	{
		id: "6",
		categoryId: "sides",
		slug: "fries",
		name: "Fries",
		description: "Just fries.",
		basePriceUsd: "3.00",
		basePriceLbp: 268500,
		isAvailable: true,
		isVisible: true,
		photoUrl: null,
		displayOrder: 1,
		isVegetarian: true,
		modifierGroups: [],
	},
	{
		id: "7",
		categoryId: "shakes",
		slug: "chocolate-milkshake",
		name: "Chocolate Milkshake",
		description: "Chocolate",
		basePriceUsd: "5.00",
		basePriceLbp: 447500,
		isAvailable: true,
		isVisible: true,
		photoUrl: null,
		displayOrder: 1,
		isVegetarian: true,
		modifierGroups: [],
	},
	{
		id: "8",
		categoryId: "shakes",
		slug: "vanilla-milkshake",
		name: "Vanilla Milkshake",
		description: "Vanilla",
		basePriceUsd: "5.00",
		basePriceLbp: 447500,
		isAvailable: true,
		isVisible: true,
		photoUrl: null,
		displayOrder: 2,
		isVegetarian: true,
		modifierGroups: [],
	},
];

export default async function MenuPage() {
	let data: MenuResponse | null = null;

	try {
		data = await api.get<MenuResponse>("/v1/menu");
	} catch {
		// API is down -- fall through to static fallback
	}

	const categories = data
		? [...data.categories].sort((a, b) => a.displayOrder - b.displayOrder)
		: STATIC_CATEGORIES;

	const items = data ? data.items.filter((item) => item.isVisible) : STATIC_ITEMS;

	return <MenuClient categories={categories} items={items} />;
}
