import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function NotFoundPage() {
	const t = useTranslations("error");

	return (
		<section className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-5 text-center">
			<div className="font-display text-[8rem] leading-none text-meat/20">404</div>
			<h1 className="font-display mt-4 text-3xl text-ink">{t("notFound")}</h1>
			<div className="mt-8 flex gap-4">
				<Link
					href="/"
					className="rounded-full bg-meat px-6 py-3 text-sm font-semibold text-paper hover:bg-meat-deep"
				>
					{t("goHome")}
				</Link>
				<Link
					href="/menu"
					className="rounded-full border-2 border-ink px-6 py-3 text-sm font-semibold text-ink hover:bg-ink hover:text-paper"
				>
					{t("goMenu")}
				</Link>
			</div>
		</section>
	);
}
