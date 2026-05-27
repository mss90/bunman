export default async function MerchDetailPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;

	return (
		<section className="mx-auto max-w-7xl px-5 py-16">
			<h1 className="font-display text-4xl text-ink">{slug}</h1>
			<div className="mt-8 text-ink-soft">Merch product detail will be rendered here.</div>
		</section>
	);
}
