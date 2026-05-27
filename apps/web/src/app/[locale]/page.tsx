"use client";

import { Bunman } from "@bunman/mascot";
import "@bunman/mascot/animations.css";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

const MENU_CARDS = ["menuCard1", "menuCard2", "menuCard3", "menuCard4"] as const;

export default function HomePage() {
	const t = useTranslations("home");
	const tc = useTranslations("common");
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		// trigger entrance on next frame so the browser has painted the initial state
		const raf = requestAnimationFrame(() => {
			el.dataset.entered = "true";
		});
		return () => cancelAnimationFrame(raf);
	}, []);

	return (
		<div ref={containerRef} className="group/enter">
			{/* ───────────────────── HERO ───────────────────── */}
			<section className="mx-auto max-w-7xl px-5 py-20">
				<div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
					{/* LEFT — copy */}
					<div className="lg:col-span-7">
						{/* eyebrow */}
						<p
							className="
								caps text-meat
								translate-y-4 opacity-0
								transition-all duration-700 ease-[cubic-bezier(0.2,0.7,0.1,1)]
								delay-[200ms]
								group-data-[entered=true]/enter:translate-y-0
								group-data-[entered=true]/enter:opacity-100
								motion-reduce:!translate-y-0 motion-reduce:!opacity-100
							"
						>
							{t("eyebrow")}
						</p>

						{/* headline */}
						<h1
							className="
								font-display mt-4 text-[clamp(3rem,8vw,9rem)] leading-[0.9] text-ink
								translate-y-6 opacity-0
								transition-all duration-700 ease-[cubic-bezier(0.2,0.7,0.1,1)]
								delay-[400ms]
								group-data-[entered=true]/enter:translate-y-0
								group-data-[entered=true]/enter:opacity-100
								motion-reduce:!translate-y-0 motion-reduce:!opacity-100
							"
						>
							{t("headline")}
						</h1>

						{/* body + CTAs */}
						<div
							className="
								translate-y-4 opacity-0
								transition-all duration-700 ease-[cubic-bezier(0.2,0.7,0.1,1)]
								delay-[800ms]
								group-data-[entered=true]/enter:translate-y-0
								group-data-[entered=true]/enter:opacity-100
								motion-reduce:!translate-y-0 motion-reduce:!opacity-100
							"
						>
							<p className="mt-6 max-w-md text-lg text-ink-soft">{t("body")}</p>

							<div className="mt-8 flex flex-wrap gap-4">
								<Link
									href="/menu"
									className="rounded-full bg-meat px-8 py-3.5 text-sm font-semibold text-paper transition-colors duration-[var(--dur-fast)] hover:bg-meat-deep"
								>
									{tc("orderNow")}
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
					</div>

					{/* RIGHT — hero composition */}
					<div
						className="
							flex items-center justify-center lg:col-span-5
							scale-90 opacity-0
							transition-all duration-700 ease-[cubic-bezier(0.2,0.7,0.1,1)]
							delay-[400ms]
							group-data-[entered=true]/enter:scale-100
							group-data-[entered=true]/enter:opacity-100
							motion-reduce:!scale-100 motion-reduce:!opacity-100
						"
					>
						<div className="relative flex items-center justify-center">
							{/* meat-red oval blob */}
							<div className="absolute h-72 w-60 rounded-[50%] bg-meat/15 lg:h-[26rem] lg:w-[22rem]" />
							<Bunman pose="idle" size={320} className="relative z-10" />
						</div>
					</div>
				</div>
			</section>

			{/* ───────────── THE MENU, BRIEFLY ───────────── */}
			<section className="mx-auto max-w-7xl px-5 py-16">
				<h2 className="font-display text-4xl text-ink lg:text-5xl">{t("menuBrieflyHeading")}</h2>

				<div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{MENU_CARDS.map((key) => (
						<Link
							key={key}
							href="/menu"
							className="group/card rounded-2xl border border-rule bg-paper-2 p-6 transition-colors duration-[var(--dur-fast)] hover:border-meat/40"
						>
							<div className="flex h-32 items-center justify-center rounded-xl bg-meat/10">
								<span className="font-display text-3xl text-meat/30">BM</span>
							</div>
							<p className="mt-4 font-semibold text-ink group-hover/card:text-meat transition-colors duration-[var(--dur-fast)]">
								{t(key)}
							</p>
							<p className="caps mt-1 text-ink-soft/60">{tc("viewMenu")}</p>
						</Link>
					))}
				</div>
			</section>

			{/* ───────────────── THE LORE ───────────────── */}
			<section className="mx-auto max-w-7xl px-5 py-16">
				<h2 className="font-display text-4xl text-ink lg:text-5xl">{t("loreHeading")}</h2>

				<article className="mt-10 max-w-[65ch] space-y-6 text-lg leading-relaxed text-ink-soft">
					<p className="first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-7xl first-letter:leading-none first-letter:text-meat">
						{t("loreP1")}
					</p>
					<p>{t("loreP2")}</p>
					<p>{t("loreP3")}</p>
				</article>
			</section>

			{/* ──────────── WHERE TO FIND US ──────────── */}
			<section className="mx-auto max-w-7xl px-5 py-16 pb-24">
				<h2 className="font-display text-4xl text-ink lg:text-5xl">{t("findUsHeading")}</h2>

				<div className="mt-10 space-y-3 text-lg text-ink-soft">
					<p>{t("findUsAddress")}</p>
					<p>{t("findUsHours")}</p>
					<p>{t("findUsPhone")}</p>
				</div>
			</section>
		</div>
	);
}
