export function SiteFooter() {
	return (
		<footer className="bg-[#3d5a3a] text-[#FFF8EC]">
			<div className="mx-auto max-w-7xl px-5 py-6">
				<div className="flex flex-col items-center gap-3 text-center">
					<p className="text-xs uppercase tracking-[0.2em] text-[#FFF8EC]/70">
						Mar Mikhael, Beirut &middot; 12pm&ndash;12am &middot; +961 3 286 626
					</p>

					<div className="flex items-center gap-5 text-xs">
						<a
							href="https://www.instagram.com/bunmanburgers"
							target="_blank"
							rel="noopener noreferrer"
							className="text-[#FFF8EC]/50 hover:text-[#FFF8EC] hover:underline"
						>
							Instagram
						</a>
						<a
							href="https://maps.app.goo.gl/iEjWMc5LqsenitaW8"
							target="_blank"
							rel="noopener noreferrer"
							className="text-[#FFF8EC]/50 hover:text-[#FFF8EC] hover:underline"
						>
							Maps
						</a>
					</div>

					<p className="text-[10px] uppercase tracking-[0.15em] text-[#FFF8EC]/30">
						Great burgers. Bad tantrums.
					</p>
				</div>
			</div>
		</footer>
	);
}
