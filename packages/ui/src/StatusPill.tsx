const statusColors: Record<string, string> = {
	received: "bg-[#0d0d0d] text-[#fff]",
	cooking: "bg-[#0d0d0d] text-[#fff]",
	ready: "bg-[#0d0d0d] text-[#fff]",
	out_for_delivery: "bg-[#0d0d0d] text-[#fff]",
	delivered: "bg-[#d4d4d4] text-[#404040]",
	cancelled: "bg-[#d4d4d4] text-[#404040]",
	pending: "bg-[#0d0d0d] text-[#fff]",
	paid: "bg-[#0d0d0d] text-[#fff]",
	failed: "bg-[#d4d4d4] text-[#404040]",
	fulfilled: "bg-[#d4d4d4] text-[#404040]",
};

interface StatusPillProps {
	status: string;
	className?: string;
}

export function StatusPill({ status, className = "" }: StatusPillProps) {
	const colors = statusColors[status] ?? "bg-[#d4d4d4] text-[#404040]";
	const label = status.replace(/_/g, " ");

	return (
		<span
			className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${colors} ${className}`}
		>
			{label}
		</span>
	);
}
