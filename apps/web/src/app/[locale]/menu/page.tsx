import { useTranslations } from "next-intl";

export default function MenuPage() {
	const t = useTranslations("menu");

	return (
		<section className="mx-auto max-w-7xl px-5 py-16">
			<p className="caps text-meat">{t("eyebrow")}</p>
			<h1 className="font-display mt-2 text-5xl text-ink">{t("headline")}</h1>
			<div className="mt-12 text-ink-soft">Menu items will be rendered here.</div>
		</section>
	);
}
