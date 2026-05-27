import { Link } from "@/i18n/navigation";

export default function NotFoundPage() {
	return (
		<section className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-5 text-center">
			<div className="font-display text-8xl leading-none text-black/10">404</div>
			<p className="mt-4 text-lg text-black/60">Page not found.</p>

			<div className="mt-10 flex gap-6">
				<Link
					href="/"
					className="text-sm text-black/50 underline underline-offset-4 transition-opacity hover:opacity-50"
				>
					Go home
				</Link>
				<Link
					href="/menu"
					className="text-sm text-black/50 underline underline-offset-4 transition-opacity hover:opacity-50"
				>
					View menu
				</Link>
			</div>
		</section>
	);
}
