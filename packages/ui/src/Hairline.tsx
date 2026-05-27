interface HairlineProps {
	className?: string;
}

export function Hairline({ className = "" }: HairlineProps) {
	return <hr className={`border-t border-[rgba(13,13,13,0.12)] ${className}`} />;
}
