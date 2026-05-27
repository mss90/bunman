interface ProudProps {
	size: number;
	static?: boolean;
}

export function Proud({ size, static: isStatic }: ProudProps) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 200 220"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={isStatic ? "" : "bm-animated"}
			role="img"
			aria-label="Bunman holding a burger proudly"
		>
			{/* Body */}
			<rect x="75" y="130" width="50" height="50" rx="10" fill="#b62a1a" />
			{/* Legs */}
			<rect x="82" y="178" width="14" height="20" rx="6" fill="currentColor" />
			<rect x="104" y="178" width="14" height="20" rx="6" fill="currentColor" />
			{/* Left hand (down, relaxed) */}
			<ellipse
				cx="55"
				cy="155"
				rx="20"
				ry="15"
				fill="#f2b300"
				stroke="currentColor"
				strokeWidth="2.5"
			/>
			{/* Right hand (holding burger up high) */}
			<g
				style={
					isStatic
						? undefined
						: { animation: "bm-bob 2s ease-in-out infinite", transformOrigin: "150px 80px" }
				}
			>
				{/* Right arm raised */}
				<rect
					x="130"
					y="90"
					width="12"
					height="45"
					rx="6"
					fill="#b62a1a"
					transform="rotate(10 136 90)"
				/>
				{/* Right hand */}
				<ellipse
					cx="148"
					cy="85"
					rx="20"
					ry="15"
					fill="#f2b300"
					stroke="currentColor"
					strokeWidth="2.5"
				/>
				{/* Burger being held */}
				<ellipse cx="148" cy="70" rx="18" ry="6" fill="#f2b300" />
				<rect x="132" y="68" width="32" height="5" rx="2" fill="#b62a1a" />
				<ellipse cx="148" cy="66" rx="18" ry="6" fill="#f2b300" />
				<rect x="136" y="62" width="6" height="4" rx="1" fill="#5a7d2a" />
				<rect x="144" y="62" width="6" height="4" rx="1" fill="#5a7d2a" />
			</g>
			{/* Head */}
			<circle cx="100" cy="82" r="48" fill="#f2b300" stroke="currentColor" strokeWidth="3" />
			{/* Paper hat */}
			<polygon
				points="72,48 100,18 128,48"
				fill="#fff8ec"
				stroke="currentColor"
				strokeWidth="2.5"
				strokeLinejoin="round"
			/>
			<rect
				x="68"
				y="46"
				width="64"
				height="8"
				rx="3"
				fill="#fff8ec"
				stroke="currentColor"
				strokeWidth="2"
			/>
			{/* Eyes (proud, confident) */}
			<circle cx="84" cy="78" r="5" fill="currentColor" />
			<circle cx="116" cy="78" r="5" fill="currentColor" />
			{/* Eyebrow raise */}
			<line
				x1="76"
				y1="66"
				x2="92"
				y2="68"
				stroke="currentColor"
				strokeWidth="2.5"
				strokeLinecap="round"
			/>
			<line
				x1="108"
				y1="68"
				x2="124"
				y2="66"
				stroke="currentColor"
				strokeWidth="2.5"
				strokeLinecap="round"
			/>
			{/* Smirk */}
			<path
				d="M88 98 Q100 106 112 96"
				stroke="currentColor"
				strokeWidth="2.5"
				fill="none"
				strokeLinecap="round"
			/>
		</svg>
	);
}
