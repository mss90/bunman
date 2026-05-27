import Link from "next/link";

export default function NotFoundPage() {
	return (
		<section className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center bg-[#FFF8EC] px-5 text-center">
			<div className="font-display text-8xl leading-none text-[#0d0d0d]/10">404</div>
			<p className="mt-4 text-lg text-[#0d0d0d]/60">Page not found.</p>

			<div className="mt-10 flex gap-6">
				<Link
					href="/en"
					className="rounded-full bg-[#0d0d0d] px-6 py-3 text-sm font-semibold text-[#FFF8EC] transition-opacity hover:opacity-80"
				>
					Go home
				</Link>
				<Link
					href="/en/menu"
					className="rounded-full border border-[#0d0d0d]/20 px-6 py-3 text-sm font-semibold text-[#0d0d0d] transition-opacity hover:opacity-70"
				>
					View menu
				</Link>
			</div>
		</section>
	);
}
