export function SiteFooter() {
	return (
		<footer className="bg-[#111] text-white">
			<div className="mx-auto max-w-7xl px-5 py-10">
				<div className="flex flex-col items-center gap-6 text-center">
					<p className="text-sm text-white/70">Mar Mikhael, Beirut | Open 7/7 12pm &ndash; 12am</p>

					<div className="flex items-center gap-6 text-sm">
						<a
							href="https://instagram.com/bunmanburgers"
							target="_blank"
							rel="noopener noreferrer"
							className="text-white/70 hover:text-white hover:underline"
						>
							@bunmanburgers
						</a>
						<a
							href="https://maps.google.com/?q=Bunman+Burgers+Mar+Mikhael+Beirut"
							target="_blank"
							rel="noopener noreferrer"
							className="text-white/70 hover:text-white hover:underline"
						>
							Google Maps
						</a>
						<a href="tel:+9613286626" className="text-white/70 hover:text-white hover:underline">
							+961 3 286 626
						</a>
					</div>

					<p className="text-xs text-white/40">Great burgers. Bad tantrums. No returns.</p>

					<p className="text-xs text-white/40">Bunman Burgers 2025 &copy;</p>
				</div>
			</div>
		</footer>
	);
}
