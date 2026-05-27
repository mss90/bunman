interface EmptyProps {
	size: number;
	static?: boolean;
}

export function Empty({ size, static: isStatic }: EmptyProps) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 200 200"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={isStatic ? "" : "bm-animated"}
			role="img"
			aria-label="Bunman looking at an empty bun"
		>
			{/* Body */}
			<rect x="75" y="120" width="50" height="50" rx="10" fill="#b62a1a" />
			{/* Legs */}
			<rect x="82" y="168" width="14" height="20" rx="6" fill="currentColor" />
			<rect x="104" y="168" width="14" height="20" rx="6" fill="currentColor" />
			{/* Hands holding empty bun */}
			<ellipse
				cx="60"
				cy="138"
				rx="20"
				ry="15"
				fill="#f2b300"
				stroke="currentColor"
				strokeWidth="2.5"
			/>
			<ellipse
				cx="140"
				cy="138"
				rx="20"
				ry="15"
				fill="#f2b300"
				stroke="currentColor"
				strokeWidth="2.5"
			/>
			{/* Empty bun (held between hands) */}
			<ellipse
				cx="100"
				cy="130"
				rx="30"
				ry="10"
				fill="#f2b300"
				stroke="currentColor"
				strokeWidth="2"
			/>
			<ellipse
				cx="100"
				cy="140"
				rx="30"
				ry="10"
				fill="#f2b300"
				stroke="currentColor"
				strokeWidth="2"
			/>
			{/* Nothing inside the bun — just the gap */}
			<rect x="72" y="130" width="56" height="10" fill="#fff8ec" />
			{/* Head (looking down at bun) */}
			<g transform="rotate(8 100 72)">
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
				{/* Eyes (sad, looking down) */}
				<g
					style={
						isStatic
							? undefined
							: { animation: "bm-blink 5s ease-in-out infinite", transformOrigin: "84px 74px" }
					}
				>
					<circle cx="84" cy="74" r="5" fill="currentColor" />
				</g>
				<g
					style={
						isStatic
							? undefined
							: { animation: "bm-blink 5s ease-in-out infinite", transformOrigin: "116px 74px" }
					}
				>
					<circle cx="116" cy="74" r="5" fill="currentColor" />
				</g>
				{/* Sad eyebrows */}
				<line
					x1="76"
					y1="62"
					x2="90"
					y2="58"
					stroke="currentColor"
					strokeWidth="2.5"
					strokeLinecap="round"
				/>
				<line
					x1="110"
					y1="58"
					x2="124"
					y2="62"
					stroke="currentColor"
					strokeWidth="2.5"
					strokeLinecap="round"
				/>
				{/* Frown */}
				<path
					d="M88 92 Q100 86 112 92"
					stroke="currentColor"
					strokeWidth="2.5"
					fill="none"
					strokeLinecap="round"
				/>
			</g>
		</svg>
	);
}
