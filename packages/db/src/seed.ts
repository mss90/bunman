import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema.js";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
	throw new Error("DATABASE_URL environment variable is required");
}

const FX_RATE_LBP = Number(process.env.FX_RATE_LBP ?? "89500");

function toLbp(usd: number): number {
	return Math.ceil((usd * FX_RATE_LBP) / 5000) * 5000;
}

function generateShortId(): string {
	const chars = "2346789ABCDEFGHJKLMNPQRSTUVWXYZ";
	let result = "BM";
	for (let i = 0; i < 4; i++) {
		result += chars[Math.floor(Math.random() * chars.length)];
	}
	return result;
}

function first<T>(arr: T[]): T {
	const item = arr[0];
	if (item === undefined) throw new Error("Expected at least one row from insert");
	return item;
}

async function seed() {
	const sql = neon(databaseUrl!);
	const db = drizzle(sql, { schema });

	console.log("Seeding database...");

	const branch = first(
		await db
			.insert(schema.branches)
			.values({
				slug: "mar-mikhael",
				name: "Mar Mikhael",
				address: "Mar Mikhael, Beirut, Lebanon",
				phone: "+961 1 000 000",
				whatsapp: "+9611000000",
				lat: "33.8985",
				lng: "35.5188",
				isOpen: true,
				hoursJson: JSON.stringify({
					mon: { open: "12:00", close: "00:00" },
					tue: { open: "12:00", close: "00:00" },
					wed: { open: "12:00", close: "00:00" },
					thu: { open: "12:00", close: "00:00" },
					fri: { open: "12:00", close: "00:00" },
					sat: { open: "12:00", close: "00:00" },
					sun: { open: "12:00", close: "00:00" },
				}),
				timezone: "Asia/Beirut",
			})
			.returning(),
	);
	console.log("  Branch:", branch.name);

	const burgers = first(
		await db
			.insert(schema.categories)
			.values({ slug: "burgers", name: "Burgers", displayOrder: 1 })
			.returning(),
	);
	const sides = first(
		await db
			.insert(schema.categories)
			.values({ slug: "sides", name: "Sides", displayOrder: 2 })
			.returning(),
	);
	const shakes = first(
		await db
			.insert(schema.categories)
			.values({ slug: "shakes", name: "Shakes", displayOrder: 3 })
			.returning(),
	);
	console.log("  Categories: burgers, sides, shakes");

	// TODO(prices): confirm prices with Bunman before launch
	const menuItemsData = [
		{
			categoryId: burgers.id,
			slug: "bunman-cheeseburger",
			name: "Bunman Cheeseburger",
			description: "Cheddar Cheese, Grilled Onions, Dill Pickles & Bunman Sauce",
			basePriceUsd: "7.50",
			basePriceLbp: toLbp(7.5),
			displayOrder: 1,
		},
		{
			categoryId: burgers.id,
			slug: "classic-cheeseburger",
			name: "Classic Cheeseburger",
			description: "Cheddar Cheese, Onions, Dill Pickles & Bunman Sauce",
			basePriceUsd: "6.50",
			basePriceLbp: toLbp(6.5),
			displayOrder: 2,
		},
		{
			categoryId: burgers.id,
			slug: "big-man",
			name: "Big Man",
			description: "Bun in the middle, Dill Pickles, Onions, Bunman Sauce, 2× Patty & 2× Cheese",
			basePriceUsd: "11.00",
			basePriceLbp: toLbp(11),
			displayOrder: 3,
		},
		{
			categoryId: burgers.id,
			slug: "double-bunman",
			name: "Double Bunman",
			description: "Double Bunman Cheeseburger — same fixings, 2× patty, 2× cheese",
			basePriceUsd: "10.00",
			basePriceLbp: toLbp(10),
			displayOrder: 4,
		},
		{
			categoryId: burgers.id,
			slug: "double-classic",
			name: "Double Classic",
			description: "Double Classic Cheeseburger — same fixings, 2× patty, 2× cheese",
			basePriceUsd: "9.00",
			basePriceLbp: toLbp(9),
			displayOrder: 5,
		},
		{
			categoryId: sides.id,
			slug: "fries",
			name: "Fries",
			description: "Just fries.",
			basePriceUsd: "3.00",
			basePriceLbp: toLbp(3),
			displayOrder: 1,
		},
		{
			categoryId: shakes.id,
			slug: "chocolate-milkshake",
			name: "Chocolate Milkshake",
			description: "Chocolate",
			basePriceUsd: "5.00",
			basePriceLbp: toLbp(5),
			displayOrder: 1,
		},
		{
			categoryId: shakes.id,
			slug: "vanilla-milkshake",
			name: "Vanilla Milkshake",
			description: "Vanilla",
			basePriceUsd: "5.00",
			basePriceLbp: toLbp(5),
			displayOrder: 2,
		},
	];

	const insertedItems = await db.insert(schema.menuItems).values(menuItemsData).returning();
	console.log(`  Menu items: ${insertedItems.length}`);

	const addOns = first(
		await db
			.insert(schema.modifierGroups)
			.values({
				slug: "add-ons",
				name: "Add-ons",
				minSelect: 0,
				maxSelect: 5,
				isRequired: false,
				displayOrder: 1,
			})
			.returning(),
	);

	const doneness = first(
		await db
			.insert(schema.modifierGroups)
			.values({
				slug: "doneness",
				name: "Doneness",
				minSelect: 1,
				maxSelect: 1,
				isRequired: true,
				displayOrder: 2,
			})
			.returning(),
	);

	const combo = first(
		await db
			.insert(schema.modifierGroups)
			.values({
				slug: "combo",
				name: "Make it a combo",
				minSelect: 0,
				maxSelect: 1,
				isRequired: false,
				displayOrder: 3,
			})
			.returning(),
	);
	console.log("  Modifier groups: add-ons, doneness, combo");

	await db.insert(schema.modifiers).values([
		{
			groupId: addOns.id,
			name: "Extra Cheese",
			extraUsd: "1.50",
			extraLbp: toLbp(1.5),
			displayOrder: 1,
		},
		{
			groupId: addOns.id,
			name: "Bacon",
			extraUsd: "2.00",
			extraLbp: toLbp(2),
			displayOrder: 2,
		},
		{
			groupId: addOns.id,
			name: "Extra Patty",
			extraUsd: "3.50",
			extraLbp: toLbp(3.5),
			displayOrder: 3,
		},
		{
			groupId: doneness.id,
			name: "Medium Rare",
			extraUsd: "0",
			extraLbp: 0,
			displayOrder: 1,
		},
		{
			groupId: doneness.id,
			name: "Medium",
			extraUsd: "0",
			extraLbp: 0,
			isDefault: true,
			displayOrder: 2,
		},
		{
			groupId: doneness.id,
			name: "Well Done",
			extraUsd: "0",
			extraLbp: 0,
			displayOrder: 3,
		},
		{
			groupId: combo.id,
			name: "Add Fries & Drink",
			extraUsd: "4.00",
			extraLbp: toLbp(4),
			displayOrder: 1,
		},
	]);
	console.log("  Modifiers seeded");

	const burgerItemIds = insertedItems
		.filter((item) => {
			const data = menuItemsData.find((d) => d.slug === item.slug);
			return data?.categoryId === burgers.id;
		})
		.map((item) => item.id);

	const linkValues = burgerItemIds.flatMap((menuItemId) => [
		{ menuItemId, modifierGroupId: addOns.id },
		{ menuItemId, modifierGroupId: doneness.id },
		{ menuItemId, modifierGroupId: combo.id },
	]);

	await db.insert(schema.menuItemModifierGroups).values(linkValues);
	console.log(`  Linked ${burgerItemIds.length} burgers to modifier groups`);

	const branchItemValues = insertedItems.map((item) => ({
		branchId: branch.id,
		menuItemId: item.id,
		isAvailable: true,
	}));
	await db.insert(schema.branchItemStatus).values(branchItemValues);
	console.log("  Branch item status seeded");

	await db.insert(schema.deliveryZones).values([
		{
			name: "Achrafieh / Mar Mikhael / Gemmayze",
			feeUsd: "2.00",
			feeLbp: toLbp(2),
			minOrderUsd: "10.00",
			etaMinutes: 25,
		},
		{
			name: "Hamra / Verdun / Ramlet el Baida",
			feeUsd: "3.00",
			feeLbp: toLbp(3),
			minOrderUsd: "12.00",
			etaMinutes: 35,
		},
		{
			name: "Sin el Fil / Dekwaneh / Bourj Hammoud",
			feeUsd: "4.00",
			feeLbp: toLbp(4),
			minOrderUsd: "15.00",
			etaMinutes: 45,
		},
	]);
	console.log("  Delivery zones seeded");

	await db.insert(schema.users).values({
		email: "admin@bunman.app",
		role: "admin",
	});
	console.log("  Admin user: admin@bunman.app");

	const firstBurger = first(insertedItems);
	const fakeOrders = [
		{
			shortId: generateShortId(),
			branchId: branch.id,
			customerName: "Rami K.",
			customerPhone: "+961 71 123 456",
			customerEmail: "rami@test.com",
			type: "pickup" as const,
			paymentMethod: "cash_usd" as const,
			paymentStatus: "pending" as const,
			status: "delivered" as const,
			subtotalUsd: "7.50",
			vatUsd: "0.83",
			deliveryFeeUsd: "0.00",
			totalUsd: "8.33",
			subtotalLbp: toLbp(7.5),
			vatLbp: toLbp(0.83),
			deliveryFeeLbp: 0,
			totalLbp: toLbp(8.33),
		},
		{
			shortId: generateShortId(),
			branchId: branch.id,
			customerName: "Maya S.",
			customerPhone: "+961 76 987 654",
			customerEmail: "maya@test.com",
			type: "delivery" as const,
			paymentMethod: "cash_lbp" as const,
			paymentStatus: "pending" as const,
			status: "cooking" as const,
			subtotalUsd: "21.00",
			vatUsd: "2.31",
			deliveryFeeUsd: "2.00",
			totalUsd: "25.31",
			subtotalLbp: toLbp(21),
			vatLbp: toLbp(2.31),
			deliveryFeeLbp: toLbp(2),
			totalLbp: toLbp(25.31),
			addressJson: JSON.stringify({ line1: "Gemmayze, Main St", city: "Beirut" }),
		},
		{
			shortId: generateShortId(),
			branchId: branch.id,
			customerName: "Joe B.",
			customerPhone: "+961 3 555 000",
			type: "pickup" as const,
			paymentMethod: "cash_usd" as const,
			paymentStatus: "pending" as const,
			status: "received" as const,
			subtotalUsd: "15.00",
			vatUsd: "1.65",
			deliveryFeeUsd: "0.00",
			totalUsd: "16.65",
			subtotalLbp: toLbp(15),
			vatLbp: toLbp(1.65),
			deliveryFeeLbp: 0,
			totalLbp: toLbp(16.65),
		},
	];

	const insertedOrders = await db.insert(schema.orders).values(fakeOrders).returning();

	for (const order of insertedOrders) {
		await db.insert(schema.orderItems).values({
			orderId: order.id,
			menuItemId: firstBurger.id,
			qty: 1,
			unitPriceUsd: firstBurger.basePriceUsd,
			unitPriceLbp: firstBurger.basePriceLbp,
			lineTotalUsd: firstBurger.basePriceUsd,
			lineTotalLbp: firstBurger.basePriceLbp,
			nameSnapshot: firstBurger.name,
		});
	}
	console.log(`  Fake orders: ${insertedOrders.length}`);

	console.log("\nSeed complete!");
}

seed().catch((err) => {
	console.error("Seed failed:", err);
	process.exit(1);
});
