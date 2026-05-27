import { type NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/auth/verify"];

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Allow public paths
	if (PUBLIC_PATHS.includes(pathname)) {
		return NextResponse.next();
	}

	// Allow static files / Next internals
	if (pathname.startsWith("/_next") || pathname.startsWith("/favicon") || pathname.includes(".")) {
		return NextResponse.next();
	}

	// Check for JWT cookie
	const token = request.cookies.get("bunman-admin-jwt");
	if (!token?.value) {
		const url = request.nextUrl.clone();
		url.pathname = "/";
		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
