"use client";

import { type ReactNode, useEffect, useRef } from "react";

interface DrawerProps {
	open: boolean;
	onClose: () => void;
	children: ReactNode;
	title?: string;
}

export function Drawer({ open, onClose, children, title }: DrawerProps) {
	const overlayRef = useRef<HTMLDivElement>(null);

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

	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		if (open) window.addEventListener("keydown", handleEsc);
		return () => window.removeEventListener("keydown", handleEsc);
	}, [open, onClose]);

	return (
		<>
			{/* Overlay */}
			<div
				ref={overlayRef}
				className={`fixed inset-0 z-50 bg-black/40 transition-opacity ${
					open ? "opacity-100" : "pointer-events-none opacity-0"
				}`}
				style={{ transitionDuration: "280ms" }}
				onClick={onClose}
				onKeyDown={() => {}}
				role="presentation"
			/>
			{/* biome-ignore lint/a11y/useSemanticElements: dialog element causes z-index stacking issues with open attribute */}
			<div
				role="dialog"
				aria-modal={open ? "true" : undefined}
				aria-label={title}
				className={`fixed inset-y-0 right-0 z-50 m-0 flex w-full max-w-md flex-col bg-white p-0 shadow-2xl transition-transform ${
					open ? "translate-x-0" : "pointer-events-none translate-x-full"
				}`}
				style={{
					transitionDuration: "280ms",
					transitionTimingFunction: "cubic-bezier(0.2, 0.7, 0.1, 1)",
				}}
			>
				<div className="flex items-center justify-between border-b border-[rgba(13,13,13,0.12)] px-5 py-4">
					{title && <h2 className="font-display text-xl">{title}</h2>}
					<button
						type="button"
						onClick={onClose}
						className="ml-auto p-2 text-2xl leading-none"
						aria-label="Close"
					>
						&times;
					</button>
				</div>
				<div className="flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</div>
			</div>
		</>
	);
}
