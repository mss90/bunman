"use client";

import { type ReactNode, useEffect, useState } from "react";

interface DrawerProps {
	open: boolean;
	onClose: () => void;
	children: ReactNode;
	title?: string;
}

export function Drawer({ open, onClose, children, title }: DrawerProps) {
	const [visible, setVisible] = useState(false);
	const [animateIn, setAnimateIn] = useState(false);

	// When open becomes true, first mount (visible), then on next frame animate in
	useEffect(() => {
		if (open) {
			setVisible(true);
			// Wait one frame so the translate-x-full is painted, then slide in
			const raf = requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					setAnimateIn(true);
				});
			});
			return () => cancelAnimationFrame(raf);
		}
		// When closing, animate out first, then unmount
		setAnimateIn(false);
		const timer = setTimeout(() => setVisible(false), 300);
		return () => clearTimeout(timer);
	}, [open]);

	// Lock body scroll when open
	useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	// Close on Escape key
	useEffect(() => {
		if (!open) return;
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handleEsc);
		return () => window.removeEventListener("keydown", handleEsc);
	}, [open, onClose]);

	// When not visible, render nothing — no portal, no hidden DOM, nothing
	if (!visible) return null;

	return (
		<div className="fixed inset-0 z-[9999]">
			{/* Overlay */}
			<div
				className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
					animateIn ? "opacity-100" : "opacity-0"
				}`}
				onClick={onClose}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") onClose();
				}}
				role="presentation"
				aria-hidden="true"
			/>

			{/* Panel */}
			{/* biome-ignore lint/a11y/useSemanticElements: dialog element causes z-index stacking issues with open attribute */}
			<div
				role="dialog"
				aria-modal="true"
				aria-label={title}
				className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.2,0.7,0.1,1)] ${
					animateIn ? "translate-x-0" : "translate-x-full"
				}`}
			>
				{/* Header */}
				<div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
					{title && <h2 className="text-lg font-semibold text-black">{title}</h2>}
					<button
						type="button"
						onClick={onClose}
						className="ml-auto flex h-8 w-8 items-center justify-center rounded-full text-black/60 transition-colors hover:bg-black/5 hover:text-black"
						aria-label="Close"
					>
						<svg
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</button>
				</div>

				{/* Content */}
				<div className="flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</div>
			</div>
		</div>
	);
}
