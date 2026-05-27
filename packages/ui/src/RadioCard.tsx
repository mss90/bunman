import type { InputHTMLAttributes, ReactNode } from "react";

interface RadioCardProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
	label: string;
	description?: string;
	icon?: ReactNode;
}

export function RadioCard({ label, description, icon, className = "", ...props }: RadioCardProps) {
	return (
		<label
			className={`flex cursor-pointer items-center gap-4 rounded-lg border-2 p-4 transition-colors ${
				props.checked
					? "border-[#b62a1a] bg-[#b62a1a]/5"
					: "border-[rgba(13,13,13,0.12)] hover:border-[#2b2b2b]"
			} ${className}`}
		>
			<input type="radio" className="sr-only" {...props} />
			{icon && <span className="text-2xl">{icon}</span>}
			<div>
				<span className="font-semibold text-[#0d0d0d]">{label}</span>
				{description && <span className="block text-sm text-[#2b2b2b]">{description}</span>}
			</div>
			<span
				className={`ml-auto h-5 w-5 shrink-0 rounded-full border-2 ${
					props.checked ? "border-[#b62a1a] bg-[#b62a1a]" : "border-[rgba(13,13,13,0.12)]"
				}`}
			/>
		</label>
	);
}
