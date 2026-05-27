export default function AboutPage() {
	return (
		<section className="mx-auto max-w-lg px-5 py-24 text-center">
			<h1 className="font-display text-4xl uppercase tracking-wide text-[#0d0d0d] md:text-5xl">
				Born from a tantrum.
			</h1>

			<p className="mt-6 text-base leading-relaxed text-[#0d0d0d]/50">
				What started as a late-night craving became BUNMAN. Smash burgers done right in Mar Mikhael.
			</p>

			<div className="mt-10 grid grid-cols-2 gap-4">
				<div className="rounded-2xl bg-white p-5 shadow-sm">
					<p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#0d0d0d]/30">
						Location
					</p>
					<p className="mt-2 text-sm font-semibold text-[#0d0d0d]">Mar Mikhael, Beirut</p>
				</div>
				<div className="rounded-2xl bg-white p-5 shadow-sm">
					<p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#0d0d0d]/30">
						Hours
					</p>
					<p className="mt-2 text-sm font-semibold text-[#0d0d0d]">12PM &ndash; 12AM, 7/7</p>
				</div>
			</div>
		</section>
	);
}
