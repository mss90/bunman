import { useTranslations } from "next-intl";

export function SiteFooter() {
	const t = useTranslations("footer");

	return (
		<footer className="border-t border-rule bg-grease text-paper">
			<div className="mx-auto max-w-7xl px-5 py-12">
				<div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
					<div>
						<p className="font-display text-3xl">BUNMAN</p>
						<p className="caps mt-1 text-paper/60">{t("tagline")}</p>
					</div>
					<div className="text-center md:text-right">
						<p className="text-sm text-paper/40">
							&copy; {new Date().getFullYear()} {t("rights")}
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
