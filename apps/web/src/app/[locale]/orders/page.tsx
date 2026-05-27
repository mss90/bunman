import { useTranslations } from "next-intl";

export default function OrdersHistoryPage() {
	const _t = useTranslations("cart");

	return (
		<section className="mx-auto max-w-7xl px-5 py-16">
			<h1 className="font-display text-4xl text-ink">your tantrum log.</h1>
			<div className="mt-8 text-ink-soft">Order history from IndexedDB will be rendered here.</div>
		</section>
	);
}
