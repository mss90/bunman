import Image from "next/image";

export default function AboutPage() {
	return (
		<section className="mx-auto max-w-[700px] px-5 py-24">
			<h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] uppercase leading-[0.95] text-ink">
				born from a tantrum.
			</h1>

			<article className="mt-12 space-y-6 text-lg leading-relaxed text-ink-soft">
				<p>
					Bunman didn&apos;t mean to invent the smash burger. He was just having a really bad day.
					The kind of day where you slam your fist into a ball of beef on a screaming-hot griddle
					and accidentally create the crispiest, juiciest, most unreasonably delicious burger Beirut
					has ever tasted.
				</p>
				<p>
					He opened a window in Mar Mikhael. Then a counter. Then a kitchen. Word spread the way it
					does in Beirut — fast, loud, and with opinions. Some said it was the sauce. Some said it
					was the smash technique. Bunman said nothing. He was too busy being angry and making
					burgers.
				</p>
				<p>
					Today, BUNMAN is open 7 days a week, 12pm to midnight. The menu is short because
					everything on it is perfect. The portions are honest. The attitude is not.
				</p>
				<p className="font-semibold text-ink">
					No refunds. No apologies. No second chances. Just great burgers and bad tantrums.
				</p>
			</article>

			<div className="mt-16 flex justify-center">
				<Image src="/hero-burger.gif" alt="Bunman character" width={360} height={360} unoptimized />
			</div>
		</section>
	);
}
