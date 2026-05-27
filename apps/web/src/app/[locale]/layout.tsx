import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Bagel_Fat_One, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import "../globals.css";

const display = Bagel_Fat_One({
	subsets: ["latin"],
	weight: "400",
	variable: "--font-display",
});

const body = Inter({
	subsets: ["latin"],
	variable: "--font-body",
});

export const metadata: Metadata = {
	title: "BUNMAN — Great burgers. Bad tantrums.",
	description:
		"Smash burgers born from a tantrum. Order pickup or delivery from Mar Mikhael, Beirut.",
};

export default async function LocaleLayout({
	children,
	params,
}: {
	children: ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;

	if (!routing.locales.includes(locale as "en")) {
		notFound();
	}

	const messages = await getMessages();

	return (
		<html lang={locale} className={`${display.variable} ${body.variable}`}>
			<body className="flex min-h-dvh flex-col">
				<NextIntlClientProvider messages={messages}>
					<SiteHeader />
					<main className="flex-1">{children}</main>
					<SiteFooter />
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
