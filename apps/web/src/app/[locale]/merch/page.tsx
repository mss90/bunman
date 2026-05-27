import { Bunman } from "@bunman/mascot";
import "@bunman/mascot/animations.css";

export default function MerchPage() {
	return (
		<section className="mx-auto max-w-7xl px-5 py-16">
			<p className="caps text-meat">the merch.</p>
			<h1 className="font-display mt-2 text-5xl text-ink">wear the tantrum.</h1>

			<div className="mt-16 flex flex-col items-center gap-6 text-center">
				<Bunman pose="proud" size={180} />
				<p className="max-w-md text-lg text-ink-soft">
					Merch is coming. T-shirts, hats, stickers — the whole angry wardrobe. Sign up and
					we&apos;ll let you know when it drops.
				</p>
				<div className="flex items-center gap-3">
					<input
						type="email"
						placeholder="your email"
						className="rounded-full border border-rule bg-paper-2 px-5 py-3 text-sm text-ink placeholder:text-ink-soft/40 focus:border-meat focus:outline-none"
					/>
					<button
						type="button"
						className="rounded-full bg-meat px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-meat-deep"
					>
						Notify me
					</button>
				</div>
			</div>
		</section>
	);
}
