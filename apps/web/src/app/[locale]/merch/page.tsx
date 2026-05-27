import { Bunman } from "@bunman/mascot";
import "@bunman/mascot/animations.css";

const PRODUCTS = [
	{
		name: "Bunman Hoodie",
		price: "$50",
		description: "Heavyweight cotton hoodie. Black on black Bunman embroidery.",
	},
	{
		name: "Bunman T-Shirt",
		price: "$35",
		description: "100% cotton tee. Bunman logo front, tantrum back.",
	},
];

export default function MerchPage() {
	return (
		<section className="mx-auto max-w-7xl px-5 py-16">
			<p className="caps text-ink-soft">the merch.</p>
			<h1 className="font-display mt-2 text-5xl text-ink">wear the tantrum.</h1>

			{/* Product cards */}
			<div className="mt-12 grid gap-6 sm:grid-cols-2">
				{PRODUCTS.map((product) => (
					<div
						key={product.name}
						className="flex flex-col items-center rounded-xl border border-ink bg-white p-8 text-center"
					>
						<Bunman pose="proud" size={120} />
						<h2 className="font-display mt-6 text-2xl text-ink">{product.name}</h2>
						<p className="mt-2 text-sm text-ink-soft">{product.description}</p>
						<p className="font-display mt-4 text-3xl text-ink">{product.price}</p>
						<p className="mt-2 text-xs text-ink-soft">Cash on delivery, 2-4 days</p>
					</div>
				))}
			</div>

			{/* Email signup */}
			<div className="mt-16 flex flex-col items-center gap-6 text-center">
				<p className="max-w-md text-lg text-ink-soft">
					Want to know when new merch drops? Sign up and we&apos;ll let you know.
				</p>
				<div className="flex items-center gap-3">
					<input
						type="email"
						placeholder="your email"
						className="rounded-full border border-ink bg-white px-5 py-3 text-sm text-ink placeholder:text-ink-soft/40 focus:outline-none focus:ring-1 focus:ring-ink"
					/>
					<button
						type="button"
						className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition-opacity hover:opacity-80"
					>
						Notify me
					</button>
				</div>
			</div>
		</section>
	);
}
