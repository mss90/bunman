import { Link } from "@/i18n/navigation";
import Image from "next/image";

export default function NotFoundPage() {
	return (
		<section className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-5 text-center">
			<div className="font-display text-[8rem] leading-none text-ink">404</div>
			<p className="mt-4 text-xl text-ink-soft">this page doesn&apos;t exist.</p>

			<Image
				src="/hero-burger.gif"
				alt="Bunman character"
				width={200}
				height={200}
				unoptimized
				className="mt-10"
			/>

			<div className="mt-10 flex gap-6">
				<Link href="/" className="border-b border-ink text-ink transition-opacity hover:opacity-50">
					go home
				</Link>
				<Link
					href="/menu"
					className="border-b border-ink text-ink transition-opacity hover:opacity-50"
				>
					view menu
				</Link>
			</div>
		</section>
	);
}
