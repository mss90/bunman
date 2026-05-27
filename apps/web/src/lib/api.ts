const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

class ApiError extends Error {
	constructor(
		public status: number,
		public code: string,
		message: string,
	) {
		super(message);
		this.name = "ApiError";
	}
}

async function request<T>(path: string, opts?: RequestInit): Promise<T> {
	const res = await fetch(`${API_URL}${path}`, {
		...opts,
		headers: {
			"Content-Type": "application/json",
			...opts?.headers,
		},
	});

	if (!res.ok) {
		const body = await res.json().catch(() => ({}));
		const err = body.error ?? {};
		throw new ApiError(res.status, err.code ?? "UNKNOWN", err.message ?? res.statusText);
	}

	return res.json() as Promise<T>;
}

export const api = {
	get: <T>(path: string) => request<T>(path),
	post: <T>(path: string, body: unknown) =>
		request<T>(path, { method: "POST", body: JSON.stringify(body) }),
	patch: <T>(path: string, body: unknown) =>
		request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
};
