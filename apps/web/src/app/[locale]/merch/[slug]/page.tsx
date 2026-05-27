import { Link } from "@/i18n/navigation";

export default async function MerchDetailPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;

	return (
		<section className="mx-auto max-w-7xl px-5 py-16">
			<Link href="/merch" className="caps text-meat hover:text-meat-deep">
				&larr; Back to merch
			</Link>
			<h1 className="font-display mt-6 text-4xl text-ink">{slug.replace(/-/g, " ")}</h1>
			<p className="mt-4 text-ink-soft">Product details coming soon.</p>
		</section>
	);
}
