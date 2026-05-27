interface SmashingProps {
	size: number;
	static?: boolean;
}

export function Smashing({ size, static: isStatic }: SmashingProps) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 200 220"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={isStatic ? "" : "bm-animated"}
			role="img"
			aria-label="Bunman smashing a patty"
		>
			{/* Body */}
			<rect x="75" y="120" width="50" height="50" rx="10" fill="#b62a1a" />
			{/* Legs (planted) */}
			<rect x="80" y="168" width="14" height="22" rx="6" fill="currentColor" />
			<rect x="106" y="168" width="14" height="22" rx="6" fill="currentColor" />
			{/* Arms + hands smashing down */}
			<g
				style={
					isStatic
						? undefined
						: { animation: "bm-smash 1.2s ease-in-out infinite", transformOrigin: "100px 130px" }
				}
			>
				{/* Left arm */}
				<rect
					x="48"
					y="110"
					width="12"
					height="40"
					rx="6"
					fill="#b62a1a"
					transform="rotate(-15 54 110)"
				/>
				{/* Left hand */}
				<ellipse
					cx="45"
					cy="155"
					rx="24"
					ry="16"
					fill="#f2b300"
					stroke="currentColor"
					strokeWidth="2.5"
				/>
				{/* Right arm */}
				<rect
					x="140"
					y="110"
					width="12"
					height="40"
					rx="6"
					fill="#b62a1a"
					transform="rotate(15 146 110)"
				/>
				{/* Right hand */}
				<ellipse
					cx="155"
					cy="155"
					rx="24"
					ry="16"
					fill="#f2b300"
					stroke="currentColor"
					strokeWidth="2.5"
				/>
			</g>
			{/* Splat effect */}
			{!isStatic && (
				<ellipse
					cx="100"
					cy="195"
					rx="40"
					ry="8"
					fill="#b62a1a"
					opacity="0.4"
					style={{ animation: "bm-splat 1.2s ease-in-out infinite" }}
				/>
			)}
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
			{/* Eyes (intense) */}
			<circle cx="84" cy="68" r="6" fill="currentColor" />
			<circle cx="116" cy="68" r="6" fill="currentColor" />
			{/* Angry eyebrows */}
			<line
				x1="74"
				y1="54"
				x2="92"
				y2="58"
				stroke="currentColor"
				strokeWidth="3"
				strokeLinecap="round"
			/>
			<line
				x1="108"
				y1="58"
				x2="126"
				y2="54"
				stroke="currentColor"
				strokeWidth="3"
				strokeLinecap="round"
			/>
			{/* Mouth (gritting) */}
			<path
				d="M86 88 L92 92 L98 88 L104 92 L110 88 L114 92"
				stroke="currentColor"
				strokeWidth="2.5"
				fill="none"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
