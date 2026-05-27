export default async function OrderTrackerPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	return (
		<section className="mx-auto max-w-7xl px-5 py-16">
			<p className="caps text-meat">Order #{id}</p>
			<h1 className="font-display mt-2 text-4xl text-ink">Order tracker</h1>
			<div className="mt-8 text-ink-soft">Live order status will be rendered here.</div>
		</section>
	);
}
