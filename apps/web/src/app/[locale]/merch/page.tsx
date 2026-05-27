import Image from "next/image";

const PRODUCTS = [
	{
		name: "Bunman Hoodie",
		price: "$50.00",
		image: "/merch/hoodie.png",
		description: "Heavyweight cotton hoodie. Black on black Bunman embroidery.",
	},
	{
		name: "Bunman T-Shirt",
		price: "$35.00",
		image: "/merch/tshirt.png",
		description: "100% cotton tee. Bunman logo front, tantrum back.",
	},
];

export default function MerchPage() {
	return (
		<section className="mx-auto max-w-2xl px-5 py-16">
			<h1 className="font-display text-center text-4xl uppercase tracking-wide text-ink">MERCH</h1>

			{/* Product cards */}
			<div className="mt-10 grid gap-6 sm:grid-cols-2">
				{PRODUCTS.map((product) => (
					<div
						key={product.name}
						className="relative overflow-hidden rounded-2xl bg-white shadow-sm"
					>
						{/* Product image */}
						<div className="relative aspect-square bg-[#f5f5f5]">
							<Image
								src={product.image}
								alt={product.name}
								width={400}
								height={400}
								className="h-full w-full object-cover"
							/>
						</div>

						{/* Info */}
						<div className="p-5">
							<h2 className="text-base font-semibold text-ink">{product.name}</h2>
							<p className="mt-1 text-sm text-black/50">{product.description}</p>
							<p className="mt-2 text-lg font-semibold text-ink">{product.price}</p>
							<p className="mt-1 text-xs text-black/40">Cash on delivery &middot; 2-4 days</p>

							{/* Coming soon badge */}
							<div className="mt-4">
								<span className="inline-block rounded-full bg-black/5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-black/40">
									Coming soon
								</span>
							</div>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
