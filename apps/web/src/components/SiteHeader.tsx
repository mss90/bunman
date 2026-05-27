"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function SiteHeader() {
	const t = useTranslations("common");

	return (
		<header className="sticky top-0 z-50 border-b border-rule bg-paper/95 backdrop-blur-sm">
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
				<Link href="/" className="font-display text-2xl tracking-tight text-ink">
					BUNMAN
				</Link>

				<nav className="hidden items-center gap-8 md:flex">
					<Link
						href="/menu"
						className="caps text-ink-soft hover:text-meat transition-colors duration-[var(--dur-fast)]"
					>
						{t("menu")}
					</Link>
					<Link
						href="/merch"
						className="caps text-ink-soft hover:text-meat transition-colors duration-[var(--dur-fast)]"
					>
						{t("merch")}
					</Link>
					<Link
						href="/about"
						className="caps text-ink-soft hover:text-meat transition-colors duration-[var(--dur-fast)]"
					>
						{t("about")}
					</Link>
					<Link
						href="/contact"
						className="caps text-ink-soft hover:text-meat transition-colors duration-[var(--dur-fast)]"
					>
						{t("contact")}
					</Link>
				</nav>

				<div className="flex items-center gap-4">
					<Link
						href="/menu"
						className="rounded-full bg-meat px-5 py-2 text-sm font-semibold text-paper transition-colors duration-[var(--dur-fast)] hover:bg-meat-deep"
					>
						{t("orderNow")}
					</Link>
				</div>
			</div>
		</header>
	);
}
