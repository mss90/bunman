import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import withPWAInit from "@ducanh2912/next-pwa";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const withPWA = withPWAInit({
	dest: "public",
	disable: process.env.NODE_ENV === "development",
	cacheOnFrontEndNav: true,
	aggressiveFrontEndNavCaching: true,
	reloadOnOnline: true,
	workboxOptions: {
		disableDevLogs: true,
		runtimeCaching: [
			{
				urlPattern: /\/v1\/menu$/,
				handler: "StaleWhileRevalidate",
				options: {
					cacheName: "menu-cache",
					expiration: { maxAgeSeconds: 3600 },
				},
			},
			{
				urlPattern: /\.(png|jpg|jpeg|webp|svg)$/,
				handler: "CacheFirst",
				options: {
					cacheName: "image-cache",
					expiration: { maxEntries: 100, maxAgeSeconds: 30 * 24 * 3600 },
				},
			},
		],
	},
});

const nextConfig: NextConfig = {
	transpilePackages: ["@bunman/schemas", "@bunman/ui", "@bunman/mascot"],
};

export default withPWA(withNextIntl(nextConfig));
