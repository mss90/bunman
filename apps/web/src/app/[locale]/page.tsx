"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

const featured = [
	{
		src: "/menu/bunman-single.png",
		name: "Bunman Single",
		desc: "Our signature smash patty with American cheese.",
	},
	{
		src: "/menu/big-man.png",
		name: "Big Man",
		desc: "Double stacked. No mercy.",
	},
	{
		src: "/menu/classic-single.png",
		name: "Classic Single",
		desc: "Simple. Clean. Smashed to perfection.",
	},
	{
		src: "/menu/fries.png",
		name: "Fries",
		desc: "Golden, crispy, and salted right.",
	},
] as const;

export default function HomePage() {
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
			<section className="flex min-h-[85vh] flex-col items-center justify-center px-5 py-24">
				<Image
					src="/logo.png"
					alt="BUNMAN"
					width={280}
					height={93}
					priority
					className="w-[180px] md:w-[280px]"
				/>

				<div className="mt-10 flex flex-col items-center gap-1">
					<p className="font-display text-xl uppercase tracking-[0.2em] text-black/80 md:text-3xl">
						GREAT BURGERS.
					</p>
					<p className="font-display text-xl uppercase tracking-[0.2em] text-black/80 md:text-3xl">
						BAD TANTRUMS.
					</p>
				</div>

				<div className="mt-8 h-px w-12 bg-black/20" />

				<p className="mt-6 text-xs uppercase tracking-[0.3em] text-black/40">Mar Mikhael, Beirut</p>

				<Link
					href="/menu"
					className="mt-10 rounded-full bg-black px-10 py-4 text-sm font-semibold uppercase tracking-widest text-white transition-opacity hover:opacity-80"
				>
					Order Now
				</Link>

				<Link
					href="/menu"
					className="mt-4 text-xs uppercase tracking-widest text-black/40 transition-opacity hover:opacity-70"
				>
					or view our menu &rarr;
				</Link>
			</section>

			{/* ───────────── FEATURED ITEMS ───────────── */}
			<section className="bg-[#fafafa] px-5 py-24">
				<p className="text-center text-xs font-medium uppercase tracking-widest text-black/40">
					Our Favorites
				</p>

				{/* Horizontal scroll on mobile, 4-col grid on desktop */}
				<div className="scrollbar-none mx-auto mt-12 flex max-w-5xl gap-5 overflow-x-auto px-1 pb-4 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:px-0 md:pb-0">
					{featured.map((item) => (
						<Link
							key={item.name}
							href="/menu"
							className="group flex-shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md"
							style={{ width: "min(72vw, 260px)" }}
						>
							<div className="flex items-center justify-center p-4" style={{ width: "100%" }}>
								<Image
									src={item.src}
									alt={item.name}
									width={200}
									height={200}
									className="object-contain"
								/>
							</div>
							<div className="px-5 pb-5">
								<h3 className="text-sm font-semibold text-black">{item.name}</h3>
								<p className="mt-1 text-xs text-black/50">{item.desc}</p>
							</div>
						</Link>
					))}
				</div>
			</section>

			{/* ───────────── INFO STRIP ───────────── */}
			<section className="px-5 py-20">
				<div className="mx-auto grid max-w-3xl grid-cols-1 gap-12 text-center md:grid-cols-3 md:gap-8">
					<div>
						<p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-black/30">
							Hours
						</p>
						<p className="mt-2 text-sm text-black/70">Open 7/7</p>
						<p className="text-sm text-black/70">12pm &ndash; 12am</p>
					</div>
					<div>
						<p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-black/30">
							Location
						</p>
						<p className="mt-2 text-sm text-black/70">Mar Mikhael</p>
						<p className="text-sm text-black/70">Beirut, Lebanon</p>
					</div>
					<div>
						<p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-black/30">
							Phone
						</p>
						<a
							href="tel:+9613286626"
							className="mt-2 inline-block text-sm text-black/70 transition-opacity hover:opacity-50"
						>
							+961 3 286 626
						</a>
					</div>
				</div>
			</section>
		</div>
	);
}
