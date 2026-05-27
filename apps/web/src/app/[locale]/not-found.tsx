import { Bunman } from "@bunman/mascot";
import "@bunman/mascot/animations.css";
import { Link } from "@/i18n/navigation";

export default function NotFoundPage() {
	return (
		<section className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-5 text-center">
			<Bunman pose="angry" size={180} />
			<div className="font-display mt-4 text-[6rem] leading-none text-meat/20">404</div>
			<h1 className="font-display mt-2 text-3xl text-ink">this page made bunman mad.</h1>
			<div className="mt-8 flex gap-4">
				<Link
					href="/"
					className="rounded-full bg-meat px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-meat-deep"
				>
					go home
				</Link>
				<Link
					href="/menu"
					className="rounded-full border-2 border-ink px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-paper"
				>
					go eat
				</Link>
			</div>
		</section>
	);
}
