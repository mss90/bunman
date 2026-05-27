interface AngryProps {
	size: number;
	static?: boolean;
}

export function Angry({ size, static: isStatic }: AngryProps) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 200 200"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={isStatic ? "" : "bm-animated"}
			role="img"
			aria-label="Bunman angry with steam"
		>
			{/* Body shaking */}
			<g
				style={
					isStatic
						? undefined
						: { animation: "bm-shake 1.5s ease-in-out infinite", transformOrigin: "100px 140px" }
				}
			>
				{/* Torso */}
				<rect x="75" y="120" width="50" height="50" rx="10" fill="#b62a1a" />
				{/* Left fist (clenched bun) */}
				<ellipse
					cx="50"
					cy="130"
					rx="20"
					ry="18"
					fill="#f2b300"
					stroke="currentColor"
					strokeWidth="2.5"
				/>
				<line
					x1="42"
					y1="126"
					x2="42"
					y2="134"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
				/>
				<line
					x1="48"
					y1="124"
					x2="48"
					y2="136"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
				/>
				<line
					x1="54"
					y1="124"
					x2="54"
					y2="136"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
				/>
				{/* Right fist (clenched bun) */}
				<ellipse
					cx="150"
					cy="130"
					rx="20"
					ry="18"
					fill="#f2b300"
					stroke="currentColor"
					strokeWidth="2.5"
				/>
				<line
					x1="146"
					y1="124"
					x2="146"
					y2="136"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
				/>
				<line
					x1="152"
					y1="124"
					x2="152"
					y2="136"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
				/>
				<line
					x1="158"
					y1="126"
					x2="158"
					y2="134"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
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
			{/* Steam from ears */}
			{!isStatic && (
				<>
					<circle
						cx="46"
						cy="60"
						r="4"
						fill="#b62a1a"
						opacity="0.5"
						style={{ animation: "bm-steam 1.5s ease-out infinite" }}
					/>
					<circle
						cx="42"
						cy="52"
						r="3"
						fill="#b62a1a"
						opacity="0.4"
						style={{ animation: "bm-steam 1.5s ease-out infinite 0.3s" }}
					/>
					<circle
						cx="154"
						cy="60"
						r="4"
						fill="#b62a1a"
						opacity="0.5"
						style={{ animation: "bm-steam 1.5s ease-out infinite 0.15s" }}
					/>
					<circle
						cx="158"
						cy="52"
						r="3"
						fill="#b62a1a"
						opacity="0.4"
						style={{ animation: "bm-steam 1.5s ease-out infinite 0.45s" }}
					/>
				</>
			)}
			{/* Eyes (furious) */}
			<ellipse cx="84" cy="70" rx="6" ry="5" fill="currentColor" />
			<ellipse cx="116" cy="70" rx="6" ry="5" fill="currentColor" />
			{/* V-shaped angry eyebrows */}
			<line
				x1="72"
				y1="52"
				x2="92"
				y2="60"
				stroke="currentColor"
				strokeWidth="3.5"
				strokeLinecap="round"
			/>
			<line
				x1="108"
				y1="60"
				x2="128"
				y2="52"
				stroke="currentColor"
				strokeWidth="3.5"
				strokeLinecap="round"
			/>
			{/* Mouth (angry open) */}
			<path
				d="M84 88 Q100 100 116 88"
				stroke="currentColor"
				strokeWidth="2.5"
				fill="none"
				strokeLinecap="round"
			/>
			<line
				x1="90"
				y1="92"
				x2="110"
				y2="92"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
			/>
		</svg>
	);
}
