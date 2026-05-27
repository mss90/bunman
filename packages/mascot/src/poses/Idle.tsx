interface IdleProps {
	size: number;
	static?: boolean;
}

export function Idle({ size, static: isStatic }: IdleProps) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 200 200"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={isStatic ? "" : "bm-animated"}
			role="img"
			aria-label="Bunman standing idle"
		>
			{/* Body */}
			<g
				style={
					isStatic
						? undefined
						: { animation: "bm-breathe 3s ease-in-out infinite", transformOrigin: "100px 160px" }
				}
			>
				{/* Torso */}
				<rect x="75" y="120" width="50" height="50" rx="10" fill="#b62a1a" />
				{/* Left hand (bun-shaped) */}
				<ellipse
					cx="55"
					cy="145"
					rx="22"
					ry="16"
					fill="#f2b300"
					stroke="currentColor"
					strokeWidth="2.5"
				/>
				{/* Right hand (bun-shaped) */}
				<ellipse
					cx="145"
					cy="145"
					rx="22"
					ry="16"
					fill="#f2b300"
					stroke="currentColor"
					strokeWidth="2.5"
				/>
				{/* Legs */}
				<rect x="82" y="168" width="14" height="20" rx="6" fill="currentColor" />
				<rect x="104" y="168" width="14" height="20" rx="6" fill="currentColor" />
			</g>
			{/* Head */}
			<circle cx="100" cy="72" r="48" fill="#f2b300" stroke="currentColor" strokeWidth="3" />
			{/* Paper hat */}
			<polygon
				points="72,38 100,8 128,38"
				fill="#fff8ec"
				stroke="currentColor"
				strokeWidth="2.5"
				strokeLinejoin="round"
			/>
			<rect
				x="68"
				y="36"
				width="64"
				height="8"
				rx="3"
				fill="#fff8ec"
				stroke="currentColor"
				strokeWidth="2"
			/>
			{/* Eyes */}
			<circle cx="84" cy="70" r="5" fill="currentColor" />
			<circle cx="116" cy="70" r="5" fill="currentColor" />
			{/* Eyebrows (neutral) */}
			<line
				x1="76"
				y1="58"
				x2="92"
				y2="60"
				stroke="currentColor"
				strokeWidth="2.5"
				strokeLinecap="round"
			/>
			<line
				x1="108"
				y1="60"
				x2="124"
				y2="58"
				stroke="currentColor"
				strokeWidth="2.5"
				strokeLinecap="round"
			/>
			{/* Mouth (slight frown) */}
			<path
				d="M88 90 Q100 84 112 90"
				stroke="currentColor"
				strokeWidth="2.5"
				fill="none"
				strokeLinecap="round"
			/>
		</svg>
	);
}
