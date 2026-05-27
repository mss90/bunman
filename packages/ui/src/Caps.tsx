import type { HTMLAttributes, ReactNode } from "react";

interface CapsProps extends HTMLAttributes<HTMLSpanElement> {
	children: ReactNode;
}

export function Caps({ className = "", children, ...props }: CapsProps) {
	return (
		<span
			className={`uppercase tracking-[0.18em] text-[0.72rem] font-semibold ${className}`}
			{...props}
		>
			{children}
		</span>
	);
}
