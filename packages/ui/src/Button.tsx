import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "ghost" | "caps";

const variantClasses: Record<ButtonVariant, string> = {
	primary:
		"bg-[#b62a1a] text-[#fff8ec] hover:bg-[#7d1b10] rounded-full px-6 py-3 text-sm font-semibold transition-colors",
	ghost:
		"border-2 border-[#0d0d0d] text-[#0d0d0d] hover:bg-[#0d0d0d] hover:text-[#fff8ec] rounded-full px-6 py-3 text-sm font-semibold transition-colors",
	caps: "uppercase tracking-[0.18em] text-[0.72rem] font-semibold text-[#2b2b2b] hover:text-[#b62a1a] transition-colors",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	children: ReactNode;
}

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
	return (
		<button className={`${variantClasses[variant]} ${className}`} {...props}>
			{children}
		</button>
	);
}
