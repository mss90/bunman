const COOKIE_NAME = "bunman-admin-jwt";

export function getToken(): string | null {
	if (typeof document === "undefined") return null;
	const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
	return match ? decodeURIComponent(match[1]!) : null;
}

export function setToken(jwt: string): void {
	const maxAge = 30 * 24 * 60 * 60; // 30 days in seconds
	document.cookie = `${COOKIE_NAME}=${encodeURIComponent(jwt)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function clearToken(): void {
	document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
}

export function isAuthenticated(): boolean {
	return getToken() !== null;
}
