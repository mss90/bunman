"use client";

import { clearToken } from "@/lib/auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
	{ href: "/orders", label: "Orders" },
	{ href: "/menu", label: "Menu" },
	{ href: "/branches", label: "Branches" },
];

export function AdminNav() {
	const pathname = usePathname();
	const router = useRouter();
	const [mobileOpen, setMobileOpen] = useState(false);

	function handleSignOut() {
		clearToken();
		router.replace("/");
	}

	return (
		<>
			{/* Mobile header bar */}
			<div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-grease px-4 py-3">
				<span className="font-display text-lg text-white">BUNMAN</span>
				<button
					type="button"
					onClick={() => setMobileOpen(!mobileOpen)}
					className="text-white p-1"
					aria-label="Toggle menu"
				>
					<svg
						className="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
						aria-hidden="true"
					>
						{mobileOpen ? (
							<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
						) : (
							<path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
						)}
					</svg>
				</button>
			</div>

			{/* Mobile overlay */}
			{mobileOpen && (
				<div
					className="lg:hidden fixed inset-0 z-40 bg-black/40"
					role="presentation"
					onClick={() => setMobileOpen(false)}
					onKeyDown={() => setMobileOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<aside
				className={`
					fixed top-0 left-0 z-50 h-dvh w-56 bg-grease text-white flex flex-col
					transition-transform duration-200
					lg:translate-x-0
					${mobileOpen ? "translate-x-0" : "-translate-x-full"}
				`}
			>
				<div className="px-5 py-6">
					<span className="font-display text-xl">BUNMAN</span>
					<p className="caps text-white/50 mt-0.5">Admin</p>
				</div>

				<nav className="flex-1 px-3 space-y-1">
					{NAV_ITEMS.map((item) => {
						const active = pathname.startsWith(item.href);
						return (
							<Link
								key={item.href}
								href={item.href}
								onClick={() => setMobileOpen(false)}
								className={`
									block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
									${active ? "bg-meat text-white" : "text-white/70 hover:bg-white/10 hover:text-white"}
								`}
							>
								{item.label}
							</Link>
						);
					})}
				</nav>

				<div className="px-3 pb-6">
					<button
						type="button"
						onClick={handleSignOut}
						className="w-full rounded-lg px-3 py-2.5 text-sm font-medium text-white/50 hover:bg-white/10 hover:text-white transition-colors text-left"
					>
						Sign out
					</button>
				</div>
			</aside>
		</>
	);
}
