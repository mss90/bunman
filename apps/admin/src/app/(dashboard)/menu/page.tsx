"use client";

import { adminGet, adminPatch } from "@/lib/api";
import { useEffect, useState } from "react";

type MenuItem = {
	id: string;
	name: string;
	category: string;
	price: number;
	isVisible: boolean;
	isAvailable?: boolean;
	branchId?: string;
};

type EditState = {
	id: string;
	name: string;
	category: string;
	price: string;
} | null;

export default function MenuPage() {
	const [items, setItems] = useState<MenuItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [editing, setEditing] = useState<EditState>(null);

	useEffect(() => {
		fetchMenu();
	}, []);

	async function fetchMenu() {
		try {
			const data = await adminGet<MenuItem[]>("/v1/menu");
			setItems(data);
		} catch {
			// Keep empty
		} finally {
			setLoading(false);
		}
	}

	async function toggleVisible(item: MenuItem) {
		const newVal = !item.isVisible;
		setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, isVisible: newVal } : i)));
		try {
			await adminPatch(`/v1/admin/menu-items/${item.id}`, {
				isVisible: newVal,
			});
		} catch {
			// Revert on failure
			setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, isVisible: !newVal } : i)));
		}
	}

	async function toggleAvailable(item: MenuItem) {
		const newVal = !(item.isAvailable ?? true);
		setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, isAvailable: newVal } : i)));
		try {
			await adminPatch("/v1/admin/branch-item-status", {
				branchId: item.branchId,
				menuItemId: item.id,
				isAvailable: newVal,
			});
		} catch {
			setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, isAvailable: !newVal } : i)));
		}
	}

	function startEditing(item: MenuItem) {
		setEditing({
			id: item.id,
			name: item.name,
			category: item.category,
			price: item.price.toFixed(2),
		});
	}

	async function saveEdit() {
		if (!editing) return;
		try {
			await adminPatch(`/v1/admin/menu-items/${editing.id}`, {
				name: editing.name,
				category: editing.category,
				price: Number.parseFloat(editing.price),
			});
			setItems((prev) =>
				prev.map((i) =>
					i.id === editing.id
						? {
								...i,
								name: editing.name,
								category: editing.category,
								price: Number.parseFloat(editing.price),
							}
						: i,
				),
			);
			setEditing(null);
		} catch {
			// Keep editing state on failure
		}
	}

	if (loading) {
		return (
			<div className="flex justify-center py-20">
				<div className="h-8 w-8 animate-spin rounded-full border-2 border-rule border-t-meat" />
			</div>
		);
	}

	return (
		<div>
			<h1 className="text-2xl font-bold mb-6">Menu</h1>

			{/* Edit modal */}
			{editing && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
					<div className="w-full max-w-md rounded-xl bg-paper p-6 shadow-xl">
						<h2 className="text-lg font-bold mb-4">Edit Item</h2>
						<div className="space-y-3">
							<div>
								<label htmlFor="edit-name" className="caps block mb-1 text-ink-soft">
									Name
								</label>
								<input
									id="edit-name"
									value={editing.name}
									onChange={(e) =>
										setEditing({
											...editing,
											name: e.target.value,
										})
									}
									className="w-full rounded-lg border border-rule bg-paper px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-meat"
								/>
							</div>
							<div>
								<label htmlFor="edit-category" className="caps block mb-1 text-ink-soft">
									Category
								</label>
								<input
									id="edit-category"
									value={editing.category}
									onChange={(e) =>
										setEditing({
											...editing,
											category: e.target.value,
										})
									}
									className="w-full rounded-lg border border-rule bg-paper px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-meat"
								/>
							</div>
							<div>
								<label htmlFor="edit-price" className="caps block mb-1 text-ink-soft">
									Price
								</label>
								<input
									id="edit-price"
									type="number"
									step="0.01"
									value={editing.price}
									onChange={(e) =>
										setEditing({
											...editing,
											price: e.target.value,
										})
									}
									className="w-full rounded-lg border border-rule bg-paper px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-meat"
								/>
							</div>
						</div>
						<div className="flex justify-end gap-3 mt-6">
							<button
								type="button"
								onClick={() => setEditing(null)}
								className="rounded-lg px-4 py-2 text-sm text-ink-soft hover:bg-paper-2 transition-colors"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={saveEdit}
								className="rounded-lg bg-meat px-4 py-2 text-sm font-semibold text-white hover:bg-meat-deep transition-colors"
							>
								Save
							</button>
						</div>
					</div>
				</div>
			)}

			{items.length === 0 ? (
				<div className="text-center py-20 text-ink-soft">
					<p className="text-lg">No menu items found</p>
				</div>
			) : (
				<div className="overflow-x-auto rounded-xl border border-rule">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-rule bg-paper-2">
								<th className="caps text-left px-4 py-3 text-ink-soft">Name</th>
								<th className="caps text-left px-4 py-3 text-ink-soft">Category</th>
								<th className="caps text-right px-4 py-3 text-ink-soft">Price</th>
								<th className="caps text-center px-4 py-3 text-ink-soft">Visible</th>
								<th className="caps text-center px-4 py-3 text-ink-soft">Available</th>
								<th className="px-4 py-3" />
							</tr>
						</thead>
						<tbody>
							{items.map((item) => (
								<tr
									key={item.id}
									className="border-b border-rule last:border-b-0 hover:bg-paper-2/50 transition-colors"
								>
									<td className="px-4 py-3 font-medium">{item.name}</td>
									<td className="px-4 py-3 text-ink-soft">{item.category}</td>
									<td className="px-4 py-3 text-right num">${item.price.toFixed(2)}</td>
									<td className="px-4 py-3 text-center">
										<button
											type="button"
											onClick={() => toggleVisible(item)}
											className={`
												inline-flex h-6 w-11 items-center rounded-full transition-colors
												${item.isVisible ? "bg-pickle" : "bg-rule"}
											`}
											aria-label={`Toggle visibility for ${item.name}`}
										>
											<span
												className={`
													inline-block h-4 w-4 rounded-full bg-white transition-transform
													${item.isVisible ? "translate-x-6" : "translate-x-1"}
												`}
											/>
										</button>
									</td>
									<td className="px-4 py-3 text-center">
										<button
											type="button"
											onClick={() => toggleAvailable(item)}
											className={`
												inline-flex h-6 w-11 items-center rounded-full transition-colors
												${(item.isAvailable ?? true) ? "bg-pickle" : "bg-rule"}
											`}
											aria-label={`Toggle availability for ${item.name}`}
										>
											<span
												className={`
													inline-block h-4 w-4 rounded-full bg-white transition-transform
													${(item.isAvailable ?? true) ? "translate-x-6" : "translate-x-1"}
												`}
											/>
										</button>
									</td>
									<td className="px-4 py-3">
										<button
											type="button"
											onClick={() => startEditing(item)}
											className="text-xs text-ink-soft hover:text-meat underline"
										>
											Edit
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
