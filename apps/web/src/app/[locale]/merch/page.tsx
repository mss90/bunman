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
		<section className="mx-auto max-w-2xl bg-[#FFF8EC] px-5 py-16">
			<h1 className="font-display text-center text-4xl uppercase tracking-wide text-[#0d0d0d]">
				MERCH
			</h1>

			{/* Product cards */}
			<div className="mt-10 grid gap-6 sm:grid-cols-2">
				{PRODUCTS.map((product) => (
					<div
						key={product.name}
						className="relative overflow-hidden rounded-2xl bg-white shadow-sm"
					>
						{/* Coming soon badge */}
						<div className="absolute top-3 right-3 z-10">
							<span className="inline-block rounded-full bg-[#0d0d0d]/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#FFF8EC]">
								Coming soon
							</span>
						</div>

						{/* Product image */}
						<div className="relative aspect-square bg-[#F5ECD6]">
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
							<h2 className="text-base font-semibold text-[#0d0d0d]">{product.name}</h2>
							<p className="mt-1 text-sm text-[#0d0d0d]/50">{product.description}</p>
							<p className="mt-2 text-lg font-semibold text-[#0d0d0d]">{product.price}</p>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
