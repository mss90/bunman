const CHARS = "2346789ABCDEFGHJKLMNPQRSTUVWXYZ";

export function generateShortId(): string {
	let result = "BM";
	for (let i = 0; i < 4; i++) {
		result += CHARS[Math.floor(Math.random() * CHARS.length)];
	}
	return result;
}
