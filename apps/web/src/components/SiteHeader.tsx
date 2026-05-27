"use client";

import { Link } from "@/i18n/navigation";
import { useCartStore } from "@/lib/cartStore";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { CartDrawer } from "./CartDrawer";

export function SiteHeader() {
	const t = useTranslations("common");
	const [cartOpen, setCartOpen] = useState(false);
	const totalItems = useCartStore((s) => s.totalItems());

	return (
		<>
			<header className="sticky top-0 z-40 border-b border-rule bg-paper/95 backdrop-blur-sm">
				<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
					<Link href="/" className="font-display text-2xl tracking-tight text-ink">
						BUNMAN
					</Link>

					<nav className="hidden items-center gap-8 md:flex">
						<Link
							href="/menu"
							className="caps text-ink-soft transition-colors duration-[var(--dur-fast)] hover:text-meat"
						>
							{t("menu")}
						</Link>
						<Link
							href="/merch"
							className="caps text-ink-soft transition-colors duration-[var(--dur-fast)] hover:text-meat"
						>
							{t("merch")}
						</Link>
						<Link
							href="/about"
							className="caps text-ink-soft transition-colors duration-[var(--dur-fast)] hover:text-meat"
						>
							{t("about")}
						</Link>
						<Link
							href="/contact"
							className="caps text-ink-soft transition-colors duration-[var(--dur-fast)] hover:text-meat"
						>
							{t("contact")}
						</Link>
					</nav>

					<div className="flex items-center gap-3">
						<button
							type="button"
							onClick={() => setCartOpen(true)}
							className="relative rounded-full border-2 border-ink px-4 py-1.5 text-sm font-semibold text-ink transition-colors duration-[var(--dur-fast)] hover:bg-ink hover:text-paper"
						>
							{t("cart")}
							{totalItems > 0 && (
								<span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-meat text-[10px] font-bold text-paper">
									{totalItems}
								</span>
							)}
						</button>
						<Link
							href="/menu"
							className="hidden rounded-full bg-meat px-5 py-2 text-sm font-semibold text-paper transition-colors duration-[var(--dur-fast)] hover:bg-meat-deep sm:block"
						>
							{t("orderNow")}
						</Link>
					</div>
				</div>
			</header>
			<CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
		</>
	);
}
