export default function ContactPage() {
	return (
		<section className="mx-auto max-w-7xl px-5 py-16">
			<p className="caps text-meat">find us.</p>
			<h1 className="font-display mt-2 text-5xl text-ink">Mar Mikhael, Beirut</h1>

			<div className="mt-10 grid gap-10 md:grid-cols-2">
				<div className="space-y-6">
					<div>
						<p className="caps text-ink">Address</p>
						<p className="mt-1 text-ink-soft">Mar Mikhael, Beirut, Lebanon</p>
					</div>
					<div>
						<p className="caps text-ink">Hours</p>
						<p className="mt-1 text-ink-soft">Open 7/7 — 12pm to midnight</p>
					</div>
					<div>
						<p className="caps text-ink">Phone</p>
						<p className="mt-1 text-ink-soft">+961 1 000 000</p>
					</div>
					<div>
						<p className="caps text-ink">Instagram</p>
						<a
							href="https://instagram.com/bunman"
							target="_blank"
							rel="noopener noreferrer"
							className="mt-1 inline-block text-meat hover:text-meat-deep"
						>
							@bunman
						</a>
					</div>
					<a
						href="https://wa.me/9611000000"
						target="_blank"
						rel="noopener noreferrer"
						className="mt-4 inline-block rounded-full bg-pickle px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-pickle/80"
					>
						WhatsApp us
					</a>
				</div>
				<div className="flex h-72 items-center justify-center rounded-xl bg-paper-2 text-ink-soft">
					<div className="text-center">
						<p className="font-display text-2xl text-ink/20">Map</p>
						<p className="caps mt-2 text-ink-soft/40">33.8985° N, 35.5188° E</p>
					</div>
				</div>
			</div>
		</section>
	);
}
