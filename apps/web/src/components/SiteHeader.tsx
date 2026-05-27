"use client";

import { useCartStore } from "@/lib/cartStore";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CartDrawer } from "./CartDrawer";

const NAV_LINKS = [
	{ href: "/en", labelKey: "home" },
	{ href: "/en/menu", labelKey: "menu" },
	{ href: "/en/orders", labelKey: "orders" },
	{ href: "/en/merch", labelKey: "merch" },
	{ href: "/en/about", labelKey: "about" },
	{ href: "/en/contact", labelKey: "contact" },
] as const;

export function SiteHeader() {
	const t = useTranslations("common");
	const pathname = usePathname();
	const [cartOpen, setCartOpen] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const totalItems = useCartStore((s) => s.totalItems());

	// Lock body scroll when mobile menu is open
	useEffect(() => {
		if (mobileMenuOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [mobileMenuOpen]);

	// Close mobile menu on Escape
	useEffect(() => {
		if (!mobileMenuOpen) return;
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === "Escape") setMobileMenuOpen(false);
		};
		window.addEventListener("keydown", handleEsc);
		return () => window.removeEventListener("keydown", handleEsc);
	}, [mobileMenuOpen]);

	function isActive(href: string) {
		if (href === "/en") return pathname === "/en" || pathname === "/en/";
		return pathname.startsWith(href);
	}

	return (
		<>
			<header className="sticky top-0 z-40 bg-[#FFF8EC] shadow-sm">
				<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
					{/* Logo */}
					<Link href="/en" className="flex-shrink-0">
						<Image src="/logo.png" alt="BUNMAN" width={120} height={40} className="h-8 w-auto" />
					</Link>

					{/* Desktop nav -- centered */}
					<nav className="hidden items-center gap-8 md:flex">
						{NAV_LINKS.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className={`text-sm font-medium text-[#0d0d0d] transition-colors hover:text-[#0d0d0d]/70 ${
									isActive(link.href) ? "underline underline-offset-4 decoration-2" : ""
								}`}
							>
								{t(link.labelKey)}
							</Link>
						))}
					</nav>

					{/* Right side: cart + mobile hamburger */}
					<div className="flex items-center gap-3">
						{/* Cart icon button */}
						<button
							type="button"
							onClick={() => setCartOpen(true)}
							className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-black/5"
							aria-label="Open cart"
						>
							{/* Shopping bag SVG */}
							<svg
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								width="22"
								height="22"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.8"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
								<line x1="3" y1="6" x2="21" y2="6" />
								<path d="M16 10a4 4 0 01-8 0" />
							</svg>

							{/* Badge */}
							{totalItems > 0 && (
								<span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#0d0d0d] text-[10px] font-bold text-[#FFF8EC]">
									{totalItems > 99 ? "99+" : totalItems}
								</span>
							)}
						</button>

						{/* Mobile hamburger */}
						<button
							type="button"
							onClick={() => setMobileMenuOpen(true)}
							className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full transition-colors hover:bg-black/5 md:hidden"
							aria-label="Open menu"
						>
							<span className="block h-[2px] w-5 rounded-full bg-[#0d0d0d]" />
							<span className="block h-[2px] w-5 rounded-full bg-[#0d0d0d]" />
							<span className="block h-[2px] w-5 rounded-full bg-[#0d0d0d]" />
						</button>
					</div>
				</div>
			</header>

			{/* Mobile full-screen overlay nav -- unmounts when closed */}
			{mobileMenuOpen && (
				<div className="fixed inset-0 z-[9998] bg-[#0d0d0d]" aria-hidden={!mobileMenuOpen}>
					<div className="flex h-full flex-col px-8 py-8">
						{/* Top bar: spacer + close */}
						<div className="flex items-center justify-between">
							<span className="h-8" aria-hidden="true" />
							<button
								type="button"
								onClick={() => setMobileMenuOpen(false)}
								className="flex h-10 w-10 items-center justify-center rounded-full text-[#FFF8EC] transition-colors hover:bg-white/10"
								aria-label="Close menu"
							>
								<svg
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
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

						{/* Nav links */}
						<nav className="mt-16 flex flex-1 flex-col gap-8">
							{NAV_LINKS.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									onClick={() => setMobileMenuOpen(false)}
									className={`text-3xl font-light text-[#FFF8EC] transition-opacity hover:opacity-70 ${
										isActive(link.href) ? "underline underline-offset-8 decoration-1" : ""
									}`}
								>
									{t(link.labelKey)}
								</Link>
							))}
						</nav>
					</div>
				</div>
			)}

			{/* CartDrawer */}
			<CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
		</>
	);
}
