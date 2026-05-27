export default function ContactPage() {
	return (
		<section className="mx-auto max-w-[700px] px-5 py-24">
			<h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] uppercase leading-[0.95] text-ink">
				find us.
			</h1>

			<div className="mt-12 space-y-10">
				<div>
					<p className="caps text-ink">Location</p>
					<p className="mt-2 text-lg text-ink-soft">Mar Mikhael, Beirut</p>
					<a
						href="https://maps.app.goo.gl/iEjWMc5LqsenitaW8"
						target="_blank"
						rel="noopener noreferrer"
						className="mt-1 inline-block border-b border-ink text-sm text-ink transition-opacity hover:opacity-50"
					>
						Open in Google Maps
					</a>
				</div>

				<div>
					<p className="caps text-ink">Hours</p>
					<p className="mt-2 text-lg text-ink-soft">Open 7/7 — 12pm to 12am</p>
				</div>

				<div>
					<p className="caps text-ink">Phone</p>
					<a
						href="tel:+9613286626"
						className="mt-2 inline-block text-lg text-ink-soft transition-opacity hover:opacity-50"
					>
						+961 3 286 626 (03-BUNMAN)
					</a>
				</div>

				<div>
					<p className="caps text-ink">Instagram</p>
					<a
						href="https://www.instagram.com/bunmanburgers"
						target="_blank"
						rel="noopener noreferrer"
						className="mt-2 inline-block border-b border-ink text-lg text-ink transition-opacity hover:opacity-50"
					>
						@bunmanburgers
					</a>
				</div>

				<div className="border-t border-rule pt-10">
					<p className="caps text-ink">Return Policy</p>
					<p className="mt-2 text-lg text-ink-soft">
						Bunman doesn&apos;t do refunds. Or apologies. Or second chances.
					</p>
				</div>
			</div>
		</section>
	);
}
