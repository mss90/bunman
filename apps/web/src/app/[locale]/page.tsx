import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function HomePage() {
	const t = useTranslations("home");

	return (
		<section className="mx-auto max-w-7xl px-5 py-20">
			<div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
				<div className="lg:col-span-7">
					<p className="caps text-meat">{t("eyebrow")}</p>
					<h1 className="font-display mt-4 text-[clamp(3rem,8vw,9rem)] leading-[0.9] text-ink">
						{t("headline")}
					</h1>
					<p className="mt-6 max-w-md text-lg text-ink-soft">{t("body")}</p>
					<div className="mt-8 flex flex-wrap gap-4">
						<Link
							href="/menu"
							className="rounded-full bg-meat px-8 py-3.5 text-sm font-semibold text-paper transition-colors duration-[var(--dur-fast)] hover:bg-meat-deep"
						>
							{useTranslations("common")("orderNow")}
						</Link>
						<Link
							href="/about"
							className="rounded-full border-2 border-ink px-8 py-3.5 text-sm font-semibold text-ink transition-colors duration-[var(--dur-fast)] hover:bg-ink hover:text-paper"
						>
							{t("readLegend")}
						</Link>
					</div>
					<p className="caps mt-10 text-ink-soft/60">{t("hours")}</p>
				</div>
				<div className="flex items-center justify-center lg:col-span-5">
					<div className="relative h-80 w-80 rounded-full bg-meat/10 lg:h-[28rem] lg:w-[28rem]">
						<div className="absolute inset-0 flex items-center justify-center font-display text-6xl text-meat/30">
							BM
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
