"use client";

import { Link } from "@/i18n/navigation";
import { useCartStore } from "@/lib/cartStore";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { CartDrawer } from "./CartDrawer";

export function SiteHeader() {
	const t = useTranslations("common");
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

	return (
		<>
			<header className="sticky top-0 z-40 border-b border-black/10 bg-white">
				<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
					{/* Logo */}
					<Link href="/">
						<img src="/logo.png" alt="BUNMAN" className="h-9" />
					</Link>

					{/* Desktop nav */}
					<nav className="hidden items-center gap-8 md:flex">
						<Link href="/" className="text-sm text-black hover:underline">
							{t("home")}
						</Link>
						<Link href="/menu" className="text-sm text-black hover:underline">
							{t("menu")}
						</Link>
						<Link href="/merch" className="text-sm text-black hover:underline">
							{t("merch")}
						</Link>
						<Link href="/about" className="text-sm text-black hover:underline">
							{t("about")}
						</Link>
						<Link href="/contact" className="text-sm text-black hover:underline">
							{t("contact")}
						</Link>
					</nav>

					<div className="flex items-center gap-4">
						{/* Cart button */}
						<button
							type="button"
							onClick={() => setCartOpen(true)}
							className="relative text-sm text-black hover:underline"
						>
							{t("cart")}
							{totalItems > 0 && (
								<span className="absolute -right-4 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] font-bold text-white">
									{totalItems}
								</span>
							)}
						</button>

						{/* Mobile hamburger */}
						<button
							type="button"
							onClick={() => setMobileMenuOpen(true)}
							className="flex flex-col gap-1.5 p-1 md:hidden"
							aria-label="Open menu"
						>
							<span className="block h-[2px] w-6 bg-black" />
							<span className="block h-[2px] w-6 bg-black" />
							<span className="block h-[2px] w-6 bg-black" />
						</button>
					</div>
				</div>
			</header>

			{/* Mobile full-screen overlay nav */}
			<div
				className={`fixed inset-0 z-50 bg-black transition-opacity duration-300 ${
					mobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
				}`}
			>
				<div className="flex h-full flex-col px-8 py-8">
					{/* Close button */}
					<div className="flex justify-end">
						<button
							type="button"
							onClick={() => setMobileMenuOpen(false)}
							className="text-3xl leading-none text-white"
							aria-label="Close menu"
						>
							&times;
						</button>
					</div>

					{/* Mobile nav links */}
					<nav className="mt-12 flex flex-1 flex-col gap-8">
						<Link
							href="/"
							onClick={() => setMobileMenuOpen(false)}
							className="text-3xl font-light text-white hover:underline"
						>
							{t("home")}
						</Link>
						<Link
							href="/menu"
							onClick={() => setMobileMenuOpen(false)}
							className="text-3xl font-light text-white hover:underline"
						>
							{t("menu")}
						</Link>
						<Link
							href="/merch"
							onClick={() => setMobileMenuOpen(false)}
							className="text-3xl font-light text-white hover:underline"
						>
							{t("merch")}
						</Link>
						<Link
							href="/about"
							onClick={() => setMobileMenuOpen(false)}
							className="text-3xl font-light text-white hover:underline"
						>
							{t("about")}
						</Link>
						<Link
							href="/contact"
							onClick={() => setMobileMenuOpen(false)}
							className="text-3xl font-light text-white hover:underline"
						>
							{t("contact")}
						</Link>
					</nav>
				</div>
			</div>

			<CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
		</>
	);
}
