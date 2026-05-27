"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function HomePage() {
	const t = useTranslations("home");
	const tc = useTranslations("common");
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		const raf = requestAnimationFrame(() => {
			el.dataset.entered = "true";
		});
		return () => cancelAnimationFrame(raf);
	}, []);

	return (
		<div ref={containerRef} className="group/enter">
			{/* ───────────────── HERO ───────────────── */}
			<section className="flex min-h-[80vh] flex-col items-center justify-center px-5 py-24">
				<div
					className="
						opacity-0 translate-y-4
						transition-all duration-700 ease-[cubic-bezier(0.2,0.7,0.1,1)]
						delay-[200ms]
						group-data-[entered=true]/enter:opacity-100
						group-data-[entered=true]/enter:translate-y-0
						motion-reduce:!opacity-100 motion-reduce:!translate-y-0
					"
				>
					<Image
						src="/hero-burger.gif"
						alt="Bunman character smashing burgers"
						width={500}
						height={500}
						unoptimized
						priority
						className="mx-auto"
					/>
				</div>

				<h1
					className="
						font-display mt-10 text-center text-[clamp(2.5rem,7vw,6rem)] uppercase leading-[0.95] text-ink
						opacity-0 translate-y-4
						transition-all duration-700 ease-[cubic-bezier(0.2,0.7,0.1,1)]
						delay-[500ms]
						group-data-[entered=true]/enter:opacity-100
						group-data-[entered=true]/enter:translate-y-0
						motion-reduce:!opacity-100 motion-reduce:!translate-y-0
					"
				>
					{t("headline")}
				</h1>

				<div
					className="
						mt-10
						opacity-0 translate-y-4
						transition-all duration-700 ease-[cubic-bezier(0.2,0.7,0.1,1)]
						delay-[800ms]
						group-data-[entered=true]/enter:opacity-100
						group-data-[entered=true]/enter:translate-y-0
						motion-reduce:!opacity-100 motion-reduce:!translate-y-0
					"
				>
					<Link
						href="/menu"
						className="border-b-2 border-ink pb-1 font-display text-lg uppercase tracking-widest text-ink transition-opacity hover:opacity-50"
					>
						{tc("viewMenu")}
					</Link>
				</div>
			</section>

			{/* ───────────── SECOND GIF ───────────── */}
			<section className="flex flex-col items-center px-5 py-24">
				<Image
					src="/hero-burger.gif"
					alt="Bunman character"
					width={400}
					height={400}
					unoptimized
					className="mx-auto"
				/>
			</section>

			{/* ───────────── LOCATION + HOURS ───────────── */}
			<section className="mx-auto max-w-xl px-5 py-24 text-center">
				<h2 className="font-display text-3xl uppercase text-ink lg:text-4xl">
					{t("findUsHeading")}
				</h2>
				<div className="mt-8 space-y-2 text-lg text-ink-soft">
					<p>{t("findUsAddress")}</p>
					<p>{t("findUsHours")}</p>
					<p>{t("findUsPhone")}</p>
				</div>
			</section>
		</div>
	);
}
