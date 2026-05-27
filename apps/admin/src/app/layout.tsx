import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const display = Oswald({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
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
