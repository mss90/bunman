import {
	and,
	branchItemStatus,
	deliveryZones,
	eq,
	inArray,
	menuItems,
	modifiers,
} from "@bunman/db";
import { env } from "../env.js";
import { db } from "./db.js";
import { badRequest } from "./errors.js";

interface PriceInput {
	items: { menuItemId: string; qty: number; modifierIds: string[] }[];
	branchId: string;
	type: "pickup" | "delivery";
	deliveryZoneId?: string;
}

interface PricedModifier {
	modifierId: string;
	name: string;
	extraUsd: string;
	extraLbp: number;
}

interface PricedLine {
	menuItemId: string;
	name: string;
	qty: number;
	unitUsd: string;
	lineUsd: string;
	unitLbp: number;
	lineLbp: number;
	modifiers: PricedModifier[];
}

interface PriceResult {
	lines: PricedLine[];
	subtotalUsd: string;
	vatUsd: string;
	deliveryFeeUsd: string;
	totalUsd: string;
	subtotalLbp: number;
	vatLbp: number;
	deliveryFeeLbp: number;
	totalLbp: number;
}

const VAT_RATE = 0.11;

function toLbp(usd: number): number {
	return Math.ceil((usd * env.FX_RATE_LBP) / 5000) * 5000;
}

function roundUsd(n: number): string {
	return n.toFixed(2);
}

export async function priceOrder(input: PriceInput): Promise<PriceResult> {
	const itemIds = input.items.map((i) => i.menuItemId);
	const allModifierIds = input.items.flatMap((i) => i.modifierIds);

	const [dbItems, dbModifiers, dbAvailability] = await Promise.all([
		db.select().from(menuItems).where(inArray(menuItems.id, itemIds)),
		allModifierIds.length > 0
			? db.select().from(modifiers).where(inArray(modifiers.id, allModifierIds))
			: Promise.resolve([]),
		db
			.select()
			.from(branchItemStatus)
			.where(
				and(
					eq(branchItemStatus.branchId, input.branchId),
					inArray(branchItemStatus.menuItemId, itemIds),
				),
			),
	]);

	const itemMap = new Map(dbItems.map((i) => [i.id, i]));
	const modMap = new Map(dbModifiers.map((m) => [m.id, m]));
	const availMap = new Map(dbAvailability.map((a) => [a.menuItemId, a.isAvailable]));

	for (const item of input.items) {
		const dbItem = itemMap.get(item.menuItemId);
		if (!dbItem) {
			throw badRequest(`Menu item not found: ${item.menuItemId}`);
		}
		if (availMap.get(item.menuItemId) === false) {
			throw badRequest(`Item unavailable: ${dbItem.name}`);
		}
	}

	let subtotalUsdNum = 0;
	const lines: PricedLine[] = [];

	for (const item of input.items) {
		const dbItem = itemMap.get(item.menuItemId)!;
		const baseUsd = Number(dbItem.basePriceUsd);

		let modTotalUsd = 0;
		const pricedMods: PricedModifier[] = [];

		for (const modId of item.modifierIds) {
			const mod = modMap.get(modId);
			if (!mod) {
				throw badRequest(`Modifier not found: ${modId}`);
			}
			const extraUsd = Number(mod.extraUsd);
			modTotalUsd += extraUsd;
			pricedMods.push({
				modifierId: mod.id,
				name: mod.name,
				extraUsd: mod.extraUsd,
				extraLbp: mod.extraLbp,
			});
		}

		const unitUsd = baseUsd + modTotalUsd;
		const lineUsd = unitUsd * item.qty;
		subtotalUsdNum += lineUsd;

		lines.push({
			menuItemId: item.menuItemId,
			name: dbItem.name,
			qty: item.qty,
			unitUsd: roundUsd(unitUsd),
			lineUsd: roundUsd(lineUsd),
			unitLbp: toLbp(unitUsd),
			lineLbp: toLbp(lineUsd),
			modifiers: pricedMods,
		});
	}

	let deliveryFeeUsdNum = 0;
	if (input.type === "delivery" && input.deliveryZoneId) {
		const [zone] = await db
			.select()
			.from(deliveryZones)
			.where(eq(deliveryZones.id, input.deliveryZoneId));
		if (!zone) {
			throw badRequest("Invalid delivery zone");
		}
		if (subtotalUsdNum < Number(zone.minOrderUsd)) {
			throw badRequest(
				`Minimum order for this zone is $${zone.minOrderUsd}. Current subtotal: $${roundUsd(subtotalUsdNum)}`,
			);
		}
		deliveryFeeUsdNum = Number(zone.feeUsd);
	}

	const vatUsdNum = subtotalUsdNum * VAT_RATE;
	const totalUsdNum = subtotalUsdNum + vatUsdNum + deliveryFeeUsdNum;

	return {
		lines,
		subtotalUsd: roundUsd(subtotalUsdNum),
		vatUsd: roundUsd(vatUsdNum),
		deliveryFeeUsd: roundUsd(deliveryFeeUsdNum),
		totalUsd: roundUsd(totalUsdNum),
		subtotalLbp: toLbp(subtotalUsdNum),
		vatLbp: toLbp(vatUsdNum),
		deliveryFeeLbp: toLbp(deliveryFeeUsdNum),
		totalLbp: toLbp(totalUsdNum),
	};
}
