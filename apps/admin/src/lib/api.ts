import { getToken } from "./auth";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

function headers(): HeadersInit {
	const h: Record<string, string> = {
		"Content-Type": "application/json",
	};
	const token = getToken();
	if (token) {
		h.Authorization = `Bearer ${token}`;
	}
	return h;
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
	const res = await fetch(`${BASE}${path}`, {
		method,
		headers: headers(),
		body: body ? JSON.stringify(body) : undefined,
	});

	if (!res.ok) {
		const text = await res.text().catch(() => "Unknown error");
		throw new Error(`API ${method} ${path} failed (${res.status}): ${text}`);
	}

	// Handle 204 No Content
	if (res.status === 204) {
		return undefined as T;
	}

	return res.json() as Promise<T>;
}

export function adminGet<T>(path: string): Promise<T> {
	return request<T>("GET", path);
}

export function adminPost<T>(path: string, body?: unknown): Promise<T> {
	return request<T>("POST", path, body);
}

export function adminPatch<T>(path: string, body?: unknown): Promise<T> {
	return request<T>("PATCH", path, body);
}
