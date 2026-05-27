import { Bunman } from "@bunman/mascot";
import "@bunman/mascot/animations.css";

export default function AboutPage() {
	return (
		<section className="mx-auto max-w-7xl px-5 py-16">
			<p className="caps text-meat">the legend.</p>
			<h1 className="font-display mt-2 text-5xl text-ink">born from a tantrum.</h1>

			<div className="mt-12 grid gap-12 lg:grid-cols-12">
				<article className="max-w-[65ch] text-ink-soft lg:col-span-8">
					<p className="text-lg first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-7xl first-letter:leading-none first-letter:text-meat">
						Bunman didn&apos;t mean to invent the smash burger. He was just having a really bad day.
						The kind of day where you slam your fist into a ball of beef on a screaming-hot griddle
						and accidentally create the crispiest, juiciest, most unreasonably delicious burger
						Beirut has ever tasted.
					</p>
					<p className="mt-6">
						He opened a window in Mar Mikhael. Then a counter. Then a kitchen. Word spread the way
						it does in Beirut — fast, loud, and with opinions. Some said it was the sauce. Some said
						it was the smash technique. Bunman said nothing. He was too busy being angry and making
						burgers.
					</p>
					<p className="mt-6">
						Today, BUNMAN is open 7 days a week, 12pm to midnight. The menu is short because
						everything on it is perfect. The portions are honest. The attitude is not.
					</p>
					<p className="mt-6">
						No refunds. No apologies. No second chances. Just great burgers and bad tantrums.
					</p>
				</article>
				<div className="flex items-start justify-center lg:col-span-4">
					<Bunman pose="idle" size={240} />
				</div>
			</div>
		</section>
	);
}
