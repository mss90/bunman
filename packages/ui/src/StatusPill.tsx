const statusColors: Record<string, string> = {
	received: "bg-[#f2b300] text-[#0d0d0d]",
	cooking: "bg-[#b62a1a] text-[#fff8ec]",
	ready: "bg-[#5a7d2a] text-[#fff8ec]",
	out_for_delivery: "bg-[#5a7d2a] text-[#fff8ec]",
	delivered: "bg-[#0d0d0d] text-[#fff8ec]",
	cancelled: "bg-[rgba(13,13,13,0.12)] text-[#2b2b2b]",
	pending: "bg-[#f2b300] text-[#0d0d0d]",
	paid: "bg-[#5a7d2a] text-[#fff8ec]",
	failed: "bg-[#b62a1a] text-[#fff8ec]",
	fulfilled: "bg-[#0d0d0d] text-[#fff8ec]",
};

interface StatusPillProps {
	status: string;
	className?: string;
}

export function StatusPill({ status, className = "" }: StatusPillProps) {
	const colors = statusColors[status] ?? "bg-[rgba(13,13,13,0.12)] text-[#2b2b2b]";
	const label = status.replace(/_/g, " ");

	return (
		<span
			className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${colors} ${className}`}
		>
			{label}
		</span>
	);
}
