"use client";

import { useToastStore } from "@/lib/toastStore";
import { useEffect, useState } from "react";

export function AddToCartToast() {
	const message = useToastStore((s) => s.message);
	const [visible, setVisible] = useState(false);
	const [animateIn, setAnimateIn] = useState(false);

	useEffect(() => {
		if (message) {
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
	}, [message]);

	if (!visible) return null;

	return (
		<div className="fixed bottom-24 left-1/2 z-[10000] -translate-x-1/2">
			<div
				className={`flex items-center gap-2 rounded-full bg-[#3d5a3a] px-6 py-3 shadow-lg transition-all duration-300 ${
					animateIn ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
				}`}
			>
				{/* Checkmark icon */}
				<svg
					aria-hidden="true"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="white"
					strokeWidth="2.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M5 12l5 5L20 7" />
				</svg>
				<span className="text-sm font-semibold text-white">{message}</span>
			</div>
		</div>
	);
}
