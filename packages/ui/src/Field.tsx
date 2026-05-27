import type { InputHTMLAttributes } from "react";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
	label: string;
	error?: string;
}

export function Field({ label, error, className = "", id, ...props }: FieldProps) {
	const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");

	return (
		<div className={`relative ${className}`}>
			<label
				htmlFor={fieldId}
				className="uppercase tracking-[0.18em] text-[0.72rem] font-semibold text-[#2b2b2b] block mb-1"
			>
				{label}
			</label>
			<input
				id={fieldId}
				className={`w-full border-b-2 bg-transparent py-2 text-[#0d0d0d] outline-none transition-colors focus:border-[#b62a1a] ${
					error ? "border-[#b62a1a]" : "border-[rgba(13,13,13,0.12)]"
				}`}
				{...props}
			/>
			{error && <p className="mt-1 text-xs text-[#b62a1a]">{error}</p>}
		</div>
	);
}
