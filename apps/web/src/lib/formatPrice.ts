const FX_RATE = 89500;

export function formatUsd(amount: string | number): string {
	const n = typeof amount === "string" ? Number.parseFloat(amount) : amount;
	return `$${n.toFixed(2)}`;
}

export function formatLbp(amountUsd: string | number): string {
	const n = typeof amountUsd === "string" ? Number.parseFloat(amountUsd) : amountUsd;
	const lbp = Math.ceil((n * FX_RATE) / 5000) * 5000;
	return `${lbp.toLocaleString()} LBP`;
}
