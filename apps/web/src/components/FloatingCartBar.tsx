"use client";

import { useCartStore } from "@/lib/cartStore";
import { formatUsd } from "@/lib/formatPrice";
import Link from "next/link";
import { useEffect, useState } from "react";

export function FloatingCartBar() {
	const totalItems = useCartStore((s) => s.totalItems());
	const subtotal = useCartStore((s) => s.subtotalUsd());

	const [visible, setVisible] = useState(false);
	const [animateIn, setAnimateIn] = useState(false);

	useEffect(() => {
		if (totalItems > 0) {
			setVisible(true);
			const raf = requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					setAnimateIn(true);
				});
			});
			return () => cancelAnimationFrame(raf);
		}
		setAnimateIn(false);
		const timer = setTimeout(() => setVisible(false), 300);
		return () => clearTimeout(timer);
	}, [totalItems]);

	if (!visible) return null;

	return (
		<div className="fixed bottom-0 left-0 right-0 z-[100] mb-6 px-4">
			<Link
				href="/en/checkout"
				className={`mx-auto flex max-w-lg items-center justify-between rounded-2xl bg-[#0d0d0d] px-6 py-4 shadow-2xl transition-all duration-300 ${
					animateIn ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
				}`}
			>
				<span className="text-sm font-semibold text-white">
					View bag &middot; {totalItems} {totalItems === 1 ? "item" : "items"}
				</span>
				<span className="font-display text-lg text-white">{formatUsd(subtotal)}</span>
			</Link>
		</div>
	);
}
