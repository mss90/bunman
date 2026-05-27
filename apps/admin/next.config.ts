import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	transpilePackages: ["@bunman/schemas", "@bunman/ui"],
};

export default nextConfig;
