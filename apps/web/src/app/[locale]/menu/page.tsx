import { MenuClient } from "@/components/menu/MenuClient";

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
	{ id: "desserts", slug: "desserts", name: "Desserts", displayOrder: 4 },
	{ id: "dips", slug: "dips", name: "Dips", displayOrder: 5 },
];

const BURGER_ADDONS: ModifierGroup = {
	id: "burger-addons",
	slug: "burger-addons",
	name: "Add-ons",
	minSelect: 0,
	maxSelect: 6,
	isRequired: false,
	modifiers: [
		{ id: "addon-cheese", name: "Cheese", extraUsd: "1.50", extraLbp: 134250, isDefault: false },
		{ id: "addon-jalapeno", name: "Jalapeño", extraUsd: "1.00", extraLbp: 89500, isDefault: false },
		{
			id: "addon-hot-honey",
			name: "Hot Honey",
			extraUsd: "1.50",
			extraLbp: 134250,
			isDefault: false,
		},
		{
			id: "addon-fried-onions",
			name: "Fried Onions",
			extraUsd: "1.00",
			extraLbp: 89500,
			isDefault: false,
		},
		{ id: "addon-bacon", name: "Bacon", extraUsd: "2.00", extraLbp: 179000, isDefault: false },
		{
			id: "addon-extra-patty",
			name: "Extra Patty",
			extraUsd: "3.50",
			extraLbp: 313250,
			isDefault: false,
		},
	],
};

const STATIC_ITEMS: MenuItem[] = [
	{
		id: "1",
		categoryId: "burgers",
		slug: "classic-cheeseburger",
		name: "Classic Cheeseburger",
		description: "American Cheese, Onions, Dill Pickles, Ketchup & Mustard",
		basePriceUsd: "6.50",
		basePriceLbp: 581750,
		isAvailable: true,
		isVisible: true,
		photoUrl: null,
		displayOrder: 1,
		isVegetarian: false,
		modifierGroups: [BURGER_ADDONS],
	},
	{
		id: "2",
		categoryId: "burgers",
		slug: "bunman-cheeseburger",
		name: "Bunman Cheeseburger",
		description: "American Cheese, Grilled Onions, Dill Pickles & Bunman Sauce",
		basePriceUsd: "7.50",
		basePriceLbp: 671250,
		isAvailable: true,
		isVisible: true,
		photoUrl: null,
		displayOrder: 2,
		isVegetarian: false,
		modifierGroups: [BURGER_ADDONS],
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
		modifierGroups: [BURGER_ADDONS],
	},
	{
		id: "4",
		categoryId: "burgers",
		slug: "double-bunman",
		name: "Double Bunman",
		description: "American Cheese, Grilled Onions, Dill Pickles & Bunman Sauce, 2x Patty",
		basePriceUsd: "10.00",
		basePriceLbp: 895000,
		isAvailable: true,
		isVisible: true,
		photoUrl: null,
		displayOrder: 4,
		isVegetarian: false,
		modifierGroups: [BURGER_ADDONS],
	},
	{
		id: "5",
		categoryId: "burgers",
		slug: "double-classic",
		name: "Double Classic",
		description: "American Cheese, Onions, Dill Pickles, Ketchup & Mustard, 2x Patty",
		basePriceUsd: "9.00",
		basePriceLbp: 805500,
		isAvailable: true,
		isVisible: true,
		photoUrl: null,
		displayOrder: 5,
		isVegetarian: false,
		modifierGroups: [BURGER_ADDONS],
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
		slug: "vanilla-milkshake",
		name: "Vanilla Milkshake",
		description: "Vanilla",
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
		slug: "chocolate-milkshake",
		name: "Chocolate Milkshake",
		description: "Chocolate",
		basePriceUsd: "5.00",
		basePriceLbp: 447500,
		isAvailable: true,
		isVisible: true,
		photoUrl: null,
		displayOrder: 2,
		isVegetarian: true,
		modifierGroups: [],
	},
	{
		id: "9",
		categoryId: "desserts",
		slug: "chocolate-chip-cookie",
		name: "Chocolate Chip Cookie",
		description: "Freshly baked chocolate chip cookie",
		basePriceUsd: "3.50",
		basePriceLbp: 313250,
		isAvailable: true,
		isVisible: true,
		photoUrl: null,
		displayOrder: 1,
		isVegetarian: true,
		modifierGroups: [],
	},
	{
		id: "10",
		categoryId: "dips",
		slug: "bunman-house-sauce",
		name: "Bunman House Sauce",
		description: "Our signature house sauce",
		basePriceUsd: "1.00",
		basePriceLbp: 89500,
		isAvailable: true,
		isVisible: true,
		photoUrl: null,
		displayOrder: 1,
		isVegetarian: true,
		modifierGroups: [],
	},
	{
		id: "11",
		categoryId: "dips",
		slug: "signature-herbs-sauce",
		name: "Signature Herbs Sauce",
		description: "Our signature herbs sauce",
		basePriceUsd: "1.00",
		basePriceLbp: 89500,
		isAvailable: true,
		isVisible: true,
		photoUrl: null,
		displayOrder: 2,
		isVegetarian: true,
		modifierGroups: [],
	},
];

export default function MenuPage() {
	// TODO(launch): fetch from API when backend is deployed
	// For demo: use static data for instant page load
	return <MenuClient categories={STATIC_CATEGORIES} items={STATIC_ITEMS} />;
}
