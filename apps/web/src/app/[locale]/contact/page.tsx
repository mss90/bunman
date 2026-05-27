export default function ContactPage() {
	return (
		<section className="mx-auto max-w-7xl px-5 py-16">
			<p className="caps text-meat">find us.</p>
			<h1 className="font-display mt-2 text-4xl text-ink">Mar Mikhael, Beirut</h1>
			<div className="mt-10 grid gap-8 md:grid-cols-2">
				<div className="space-y-4 text-ink-soft">
					<p>
						<span className="caps block text-ink">Address</span>
						Mar Mikhael, Beirut, Lebanon
					</p>
					<p>
						<span className="caps block text-ink">Hours</span>
						7/7 — 12pm to midnight
					</p>
					<p>
						<span className="caps block text-ink">Phone</span>
						+961 1 000 000
					</p>
					<a
						href="https://wa.me/9611000000"
						target="_blank"
						rel="noopener noreferrer"
						className="mt-4 inline-block rounded-full bg-pickle px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-pickle/80"
					>
						WhatsApp us
					</a>
				</div>
				<div className="flex h-64 items-center justify-center rounded-lg bg-paper-2 text-ink-soft">
					Map will be rendered here.
				</div>
			</div>
		</section>
	);
}
