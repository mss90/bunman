"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

const quickMenu = [
	{
		src: "/menu/bunman-single.png",
		name: "Bunman Cheeseburger",
		price: "$7.50",
	},
	{
		src: "/menu/big-man.png",
		name: "Big Man",
		price: "$11.00",
	},
	{
		src: "/menu/classic-single.png",
		name: "Classic Cheeseburger",
		price: "$6.50",
	},
	{
		src: "/menu/fries.png",
		name: "Fries",
		price: "$3.00",
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
			<section className="flex min-h-[80vh] flex-col items-center justify-center bg-[#FFF8EC] px-5 py-24">
				<Image
					src="/logo.png"
					alt="BUNMAN"
					width={320}
					height={107}
					priority
					className="w-[220px] md:w-[320px]"
				/>

				<div className="mt-8 flex flex-col items-center gap-0.5">
					<p className="font-display text-base uppercase tracking-[0.15em] text-[#0d0d0d]/60 md:text-xl">
						GREAT BURGERS.
					</p>
					<p className="font-display text-base uppercase tracking-[0.15em] text-[#0d0d0d]/60 md:text-xl">
						BAD TANTRUMS.
					</p>
				</div>

				<Link
					href="/menu"
					className="mt-10 rounded-full bg-[#0d0d0d] px-12 py-4 text-sm uppercase tracking-widest text-[#FFF8EC] transition-opacity hover:opacity-80"
				>
					ORDER NOW
				</Link>
			</section>

			{/* ───────────── QUICK MENU CARDS ───────────── */}
			<section className="bg-[#FFF8EC] px-5 pb-16 pt-4">
				<div className="scrollbar-none mx-auto flex max-w-3xl gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:pb-0">
					{quickMenu.map((item) => (
						<Link
							key={item.name}
							href="/menu"
							className="group flex-shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md"
							style={{ width: "min(72vw, 280px)" }}
						>
							<div className="flex h-40 items-center justify-center bg-[#F5ECD6]">
								<Image
									src={item.src}
									alt={item.name}
									width={160}
									height={160}
									className="h-32 w-32 object-contain"
								/>
							</div>
							<div className="flex items-center justify-between px-4 py-3">
								<span className="text-sm font-semibold text-[#0d0d0d]">{item.name}</span>
								<span className="text-sm font-medium text-[#0d0d0d]/50">{item.price}</span>
							</div>
						</Link>
					))}
				</div>
			</section>

			{/* ───────────── INFO BAR ───────────── */}
			<section className="bg-[#FFF8EC] px-5 pb-12">
				<div className="mx-auto grid max-w-xl grid-cols-3 text-center">
					<div>
						<p className="text-xs font-bold uppercase tracking-widest text-[#0d0d0d]/30">
							12PM&ndash;12AM
						</p>
					</div>
					<div>
						<p className="text-xs font-bold uppercase tracking-widest text-[#0d0d0d]/30">
							MAR MIKHAEL
						</p>
					</div>
					<div>
						<p className="text-xs font-bold uppercase tracking-widest text-[#0d0d0d]/30">
							03-BUNMAN
						</p>
					</div>
				</div>
			</section>
		</div>
	);
}
