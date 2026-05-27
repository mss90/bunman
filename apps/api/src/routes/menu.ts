import {
	branchItemStatus,
	branches,
	categories,
	menuItemModifierGroups,
	menuItems,
	modifierGroups,
	modifiers,
} from "@bunman/db";
import type { FastifyPluginAsync } from "fastify";
import { db } from "../lib/db.js";

export const menuRoutes: FastifyPluginAsync = async (app) => {
	app.get("/v1/menu", async () => {
		const [dbBranches, dbCategories, dbItems, dbGroups, dbModifiers, dbLinks, dbStatus] =
			await Promise.all([
				db.select().from(branches),
				db.select().from(categories).orderBy(categories.displayOrder),
				db.select().from(menuItems).orderBy(menuItems.displayOrder),
				db.select().from(modifierGroups).orderBy(modifierGroups.displayOrder),
				db.select().from(modifiers).orderBy(modifiers.displayOrder),
				db.select().from(menuItemModifierGroups),
				db.select().from(branchItemStatus),
			]);

		const modsByGroup = new Map<string, typeof dbModifiers>();
		for (const mod of dbModifiers) {
			const existing = modsByGroup.get(mod.groupId) ?? [];
			existing.push(mod);
			modsByGroup.set(mod.groupId, existing);
		}

		const groupMap = new Map(
			dbGroups.map((g) => [
				g.id,
				{
					...g,
					modifiers: (modsByGroup.get(g.id) ?? []).filter((m) => m.isVisible),
				},
			]),
		);

		const linksByItem = new Map<string, string[]>();
		for (const link of dbLinks) {
			const existing = linksByItem.get(link.menuItemId) ?? [];
			existing.push(link.modifierGroupId);
			linksByItem.set(link.menuItemId, existing);
		}

		const availMap = new Map<string, boolean>();
		for (const s of dbStatus) {
			availMap.set(s.menuItemId, s.isAvailable);
		}

		const items = dbItems
			.filter((item) => item.isVisible)
			.map((item) => {
				const groupIds = linksByItem.get(item.id) ?? [];
				const itemGroups = groupIds
					.map((gid) => groupMap.get(gid))
					.filter((g): g is NonNullable<typeof g> => g != null);

				return {
					id: item.id,
					categoryId: item.categoryId,
					slug: item.slug,
					name: item.name,
					description: item.description,
					photoUrl: item.photoUrl,
					photoBlurDataUrl: item.photoBlurDataUrl,
					basePriceUsd: item.basePriceUsd,
					basePriceLbp: item.basePriceLbp,
					isVegetarian: item.isVegetarian,
					isVisible: item.isVisible,
					displayOrder: item.displayOrder,
					isAvailable: availMap.get(item.id) ?? true,
					modifierGroups: itemGroups,
				};
			});

		return {
			branches: dbBranches,
			categories: dbCategories.filter((c) => c.isVisible),
			items,
		};
	});

	app.get("/v1/branches", async () => {
		const result = await db.select().from(branches);
		return result;
	});
};
