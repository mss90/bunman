import type { Metadata } from "next";
import { Bagel_Fat_One, Inter } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

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
	title: "BUNMAN Admin",
	description: "BUNMAN restaurant admin panel",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" className={`${display.variable} ${body.variable}`}>
			<body className="min-h-dvh bg-paper text-ink">{children}</body>
		</html>
	);
}
