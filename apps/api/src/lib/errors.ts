export class AppError extends Error {
	constructor(
		public statusCode: number,
		public code: string,
		message: string,
		public details?: Record<string, unknown>,
	) {
		super(message);
		this.name = "AppError";
	}
}

export function notFound(message = "Not found") {
	return new AppError(404, "NOT_FOUND", message);
}

export function badRequest(message: string, details?: Record<string, unknown>) {
	return new AppError(400, "BAD_REQUEST", message, details);
}

export function forbidden(message = "Forbidden") {
	return new AppError(403, "FORBIDDEN", message);
}

export function unauthorized(message = "Unauthorized") {
	return new AppError(401, "UNAUTHORIZED", message);
}
