export default function ContactPage() {
	return (
		<section className="mx-auto max-w-2xl px-5 py-24">
			<h1 className="font-display text-4xl uppercase tracking-wide text-black md:text-5xl">
				Find us.
			</h1>

			<div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
				{/* Location */}
				<div className="rounded-2xl bg-[#fafafa] p-8">
					<p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-black/30">
						Location
					</p>
					<p className="mt-3 text-lg font-semibold text-black">Mar Mikhael, Beirut</p>
					<a
						href="https://maps.app.goo.gl/iEjWMc5LqsenitaW8"
						target="_blank"
						rel="noopener noreferrer"
						className="mt-2 inline-block text-sm text-black/50 underline underline-offset-4 transition-opacity hover:opacity-50"
					>
						Open in Google Maps
					</a>
				</div>

				{/* Hours */}
				<div className="rounded-2xl bg-[#fafafa] p-8">
					<p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-black/30">
						Hours
					</p>
					<p className="mt-3 text-lg font-semibold text-black">Open 7/7 — 12PM to 12AM</p>
				</div>

				{/* Phone */}
				<div className="rounded-2xl bg-[#fafafa] p-8">
					<p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-black/30">
						Phone
					</p>
					<a
						href="tel:+9613286626"
						className="mt-3 inline-block text-lg font-semibold text-black transition-opacity hover:opacity-50"
					>
						+961 3 286 626
					</a>
				</div>

				{/* Instagram */}
				<div className="rounded-2xl bg-[#fafafa] p-8">
					<p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-black/30">
						Instagram
					</p>
					<a
						href="https://www.instagram.com/bunmanburgers"
						target="_blank"
						rel="noopener noreferrer"
						className="mt-3 inline-block text-lg font-semibold text-black transition-opacity hover:opacity-50"
					>
						@bunmanburgers
					</a>
				</div>
			</div>

			<p className="mt-16 text-center text-xs text-black/30">
				Bunman doesn&apos;t do refunds. Or apologies. Or second chances.
			</p>
		</section>
	);
}
