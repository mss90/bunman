import { type DBSchema, openDB } from "idb";

export interface RecentOrder {
	shortId: string;
	status: string;
	totalUsd: string;
	placedAt: string;
	type: string;
	customerName: string;
}

interface BunmanDB extends DBSchema {
	orders: {
		key: string;
		value: RecentOrder;
		indexes: { "by-date": string };
	};
}

function getDb() {
	return openDB<BunmanDB>("bunman", 1, {
		upgrade(db) {
			const store = db.createObjectStore("orders", { keyPath: "shortId" });
			store.createIndex("by-date", "placedAt");
		},
	});
}

export const recentOrders = {
	async list(): Promise<RecentOrder[]> {
		const db = await getDb();
		const all = await db.getAllFromIndex("orders", "by-date");
		return all.reverse();
	},

	async add(order: RecentOrder): Promise<void> {
		const db = await getDb();
		await db.put("orders", order);
	},

	async update(shortId: string, patch: Partial<RecentOrder>): Promise<void> {
		const db = await getDb();
		const existing = await db.get("orders", shortId);
		if (existing) {
			await db.put("orders", { ...existing, ...patch });
		}
	},

	async remove(shortId: string): Promise<void> {
		const db = await getDb();
		await db.delete("orders", shortId);
	},

	async clear(): Promise<void> {
		const db = await getDb();
		await db.clear("orders");
	},
};
