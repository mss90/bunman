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

export default async function MenuPage() {
	let data: MenuResponse | null = null;
	let error = false;

	try {
		data = await api.get<MenuResponse>("/v1/menu");
	} catch {
		error = true;
	}

	if (error || !data) {
		return (
			<section className="mx-auto max-w-7xl px-5 py-16">
				<p className="text-ink-soft">Could not load the menu right now. Please try again later.</p>
			</section>
		);
	}

	const visibleItems = data.items.filter((item) => item.isVisible);
	const sortedCategories = [...data.categories].sort((a, b) => a.displayOrder - b.displayOrder);

	return <MenuClient categories={sortedCategories} items={visibleItems} />;
}
