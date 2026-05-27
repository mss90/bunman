export default function ContactPage() {
	return (
		<section className="mx-auto max-w-2xl bg-[#FFF8EC] px-5 py-24">
			<h1 className="font-display text-center text-4xl uppercase tracking-wide text-[#0d0d0d] md:text-5xl">
				Find us.
			</h1>

			<div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
				{/* Location */}
				<div className="rounded-2xl bg-white p-6 shadow-sm">
					<p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#0d0d0d]/30">
						Location
					</p>
					<p className="mt-3 text-lg font-semibold text-[#0d0d0d]">Mar Mikhael, Beirut</p>
					<a
						href="https://maps.app.goo.gl/iEjWMc5LqsenitaW8"
						target="_blank"
						rel="noopener noreferrer"
						className="mt-2 inline-block text-sm text-[#0d0d0d]/50 underline underline-offset-4 transition-opacity hover:opacity-50"
					>
						Open in Google Maps
					</a>
				</div>

				{/* Hours */}
				<div className="rounded-2xl bg-white p-6 shadow-sm">
					<p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#0d0d0d]/30">
						Hours
					</p>
					<p className="mt-3 text-lg font-semibold text-[#0d0d0d]">Open 7/7</p>
					<p className="mt-1 text-sm text-[#0d0d0d]/50">12PM to 12AM</p>
				</div>

				{/* Phone */}
				<div className="rounded-2xl bg-white p-6 shadow-sm">
					<p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#0d0d0d]/30">
						Phone
					</p>
					<a
						href="tel:+9613286626"
						className="mt-3 inline-block text-lg font-semibold text-[#0d0d0d] transition-opacity hover:opacity-50"
					>
						+961 3 286 626
					</a>
				</div>

				{/* Instagram */}
				<div className="rounded-2xl bg-white p-6 shadow-sm">
					<p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#0d0d0d]/30">
						Instagram
					</p>
					<a
						href="https://www.instagram.com/bunmanburgers"
						target="_blank"
						rel="noopener noreferrer"
						className="mt-3 inline-block text-lg font-semibold text-[#0d0d0d] transition-opacity hover:opacity-50"
					>
						@bunmanburgers
					</a>
				</div>
			</div>
		</section>
	);
}
