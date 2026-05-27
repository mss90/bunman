"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";

const featured = [
	{
		src: "/menu/bunman-single.png",
		name: "Bunman Cheeseburger",
		desc: "Our signature smash patty with American cheese.",
	},
	{
		src: "/menu/big-man.png",
		name: "Big Man",
		desc: "Double stacked. No mercy.",
	},
	{
		src: "/menu/classic-single.png",
		name: "Classic Cheeseburger",
		desc: "Simple. Clean. Smashed to perfection.",
	},
	{
		src: "/menu/fries.png",
		name: "Fries",
		desc: "Golden, crispy, and salted right.",
	},
] as const;

export default function HomePage() {
	const t = useTranslations("home");
	const tc = useTranslations("common");
	const [entered, setEntered] = useState(false);

	useEffect(() => {
		const raf = requestAnimationFrame(() => setEntered(true));
		return () => cancelAnimationFrame(raf);
	}, []);

	return (
		<div
			className={`transition-opacity duration-700 ease-out ${entered ? "opacity-100" : "opacity-0"}`}
		>
			{/* ───────────────── HERO ───────────────── */}
			<section className="flex min-h-[90vh] flex-col items-center justify-center px-5 py-24">
				<Image
					src="/logo.png"
					alt="BUNMAN"
					width={300}
					height={100}
					priority
					className="mx-auto w-[200px] md:w-[300px]"
				/>

				{/* Tagline with typographic frame */}
				<div className="mt-10 flex flex-col items-center">
					<div className="h-px w-16 bg-black" />
					<p className="font-display my-4 text-center text-2xl uppercase tracking-wide text-black md:text-4xl">
						{t("headline")}
					</p>
					<div className="h-px w-16 bg-black" />
				</div>

				{/* Location */}
				<p className="mt-6 text-sm uppercase tracking-[0.25em] text-black/60">
					Mar Mikhael, Beirut
				</p>

				{/* View Menu link */}
				<Link
					href="/menu"
					className="mt-8 text-sm uppercase tracking-widest text-black underline underline-offset-4 transition-opacity hover:opacity-50"
				>
					{tc("viewMenu")}
				</Link>
			</section>

			{/* ───────────── FEATURED ITEMS ───────────── */}
			<section className="px-5 py-24">
				<h2 className="font-display text-center text-4xl uppercase tracking-wide text-black md:text-5xl">
					The Menu
				</h2>

				<div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
					{featured.map((item) => (
						<Link
							key={item.name}
							href="/menu"
							className="group flex flex-col items-center text-center transition-opacity hover:opacity-70"
						>
							<div className="flex h-[300px] w-[300px] items-center justify-center">
								<Image
									src={item.src}
									alt={item.name}
									width={300}
									height={300}
									className="object-cover"
								/>
							</div>
							<h3 className="font-display mt-4 text-lg uppercase tracking-wide text-black">
								{item.name}
							</h3>
							<p className="mt-1 text-sm text-black/50">{item.desc}</p>
						</Link>
					))}
				</div>
			</section>

			{/* ───────────── ABOUT STRIP ───────────── */}
			<section className="mx-auto max-w-[600px] px-5 py-24 text-center">
				<h2 className="font-display text-3xl uppercase tracking-wide text-black md:text-4xl">
					Born from a tantrum.
				</h2>
				<p className="mt-6 leading-relaxed text-black/60">
					What started as a late-night craving and a refusal to settle for mediocre burgers became
					BUNMAN. We smash patties thin, sear them hard, and keep everything honest. No gimmicks.
					Just burgers done right in the heart of Beirut.
				</p>
				<Link
					href="/about"
					className="mt-6 inline-block text-sm uppercase tracking-widest text-black underline underline-offset-4 transition-opacity hover:opacity-50"
				>
					Read more &rarr;
				</Link>
			</section>

			{/* ───────────── LOCATION ───────────── */}
			<section className="px-5 py-24 text-center">
				<h2 className="font-display text-3xl uppercase tracking-wide text-black md:text-4xl">
					{t("findUsHeading")}
				</h2>
				<div className="mt-8 space-y-2 text-sm uppercase tracking-[0.2em] text-black/60">
					<p>{t("findUsAddress")}</p>
					<p>{t("findUsHours")}</p>
					<p>{t("findUsPhone")}</p>
				</div>
			</section>
		</div>
	);
}
