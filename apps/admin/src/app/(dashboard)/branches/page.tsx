"use client";

import { adminGet, adminPatch } from "@/lib/api";
import { useEffect, useState } from "react";

type Branch = {
	id: string;
	name: string;
	address: string;
	hours: string;
	isOpen: boolean;
};

export default function BranchesPage() {
	const [branches, setBranches] = useState<Branch[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchBranches();
	}, []);

	async function fetchBranches() {
		try {
			const data = await adminGet<Branch[]>("/v1/branches");
			setBranches(data);
		} catch {
			// Keep empty
		} finally {
			setLoading(false);
		}
	}

	async function toggleOpen(branch: Branch) {
		const newVal = !branch.isOpen;
		setBranches((prev) => prev.map((b) => (b.id === branch.id ? { ...b, isOpen: newVal } : b)));
		try {
			await adminPatch(`/v1/admin/branches/${branch.id}`, {
				isOpen: newVal,
			});
		} catch {
			// Revert on failure
			setBranches((prev) => prev.map((b) => (b.id === branch.id ? { ...b, isOpen: !newVal } : b)));
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
			<h1 className="text-2xl font-bold mb-6">Branches</h1>

			{branches.length === 0 ? (
				<div className="text-center py-20 text-ink-soft">
					<p className="text-lg">No branches found</p>
				</div>
			) : (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{branches.map((branch) => (
						<div key={branch.id} className="rounded-xl bg-paper-2 p-5 space-y-3">
							<div className="flex items-start justify-between">
								<div>
									<h2 className="font-bold text-lg">{branch.name}</h2>
									<p className="text-sm text-ink-soft mt-0.5">{branch.address}</p>
								</div>
								<span
									className={`caps px-2 py-0.5 rounded-full text-white ${
										branch.isOpen ? "bg-pickle" : "bg-ink-soft"
									}`}
								>
									{branch.isOpen ? "Open" : "Closed"}
								</span>
							</div>

							{branch.hours && <p className="text-sm text-ink-soft">{branch.hours}</p>}

							<button
								type="button"
								onClick={() => toggleOpen(branch)}
								className={`
									w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors
									${
										branch.isOpen
											? "bg-ink-soft text-white hover:bg-ink"
											: "bg-meat text-white hover:bg-meat-deep"
									}
								`}
							>
								{branch.isOpen ? "Close branch" : "Open branch"}
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
