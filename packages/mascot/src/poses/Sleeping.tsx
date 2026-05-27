interface SleepingProps {
	size: number;
	static?: boolean;
}

export function Sleeping({ size, static: isStatic }: SleepingProps) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 200 200"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={isStatic ? "" : "bm-animated"}
			role="img"
			aria-label="Bunman sleeping"
		>
			{/* Body (slumped) */}
			<g
				style={
					isStatic
						? undefined
						: { animation: "bm-breathe 4s ease-in-out infinite", transformOrigin: "100px 160px" }
				}
			>
				<rect x="75" y="120" width="50" height="50" rx="10" fill="#b62a1a" />
				{/* Hands resting at sides */}
				<ellipse
					cx="55"
					cy="152"
					rx="20"
					ry="14"
					fill="#f2b300"
					stroke="currentColor"
					strokeWidth="2.5"
				/>
				<ellipse
					cx="145"
					cy="152"
					rx="20"
					ry="14"
					fill="#f2b300"
					stroke="currentColor"
					strokeWidth="2.5"
				/>
				{/* Legs */}
				<rect x="82" y="168" width="14" height="20" rx="6" fill="currentColor" />
				<rect x="104" y="168" width="14" height="20" rx="6" fill="currentColor" />
			</g>
			{/* Head (tilted slightly) */}
			<g transform="rotate(5 100 72)">
				<circle cx="100" cy="72" r="48" fill="#f2b300" stroke="currentColor" strokeWidth="3" />
				{/* Hat pulled over eyes */}
				<polygon
					points="66,48 100,8 134,48"
					fill="#fff8ec"
					stroke="currentColor"
					strokeWidth="2.5"
					strokeLinejoin="round"
				/>
				<rect
					x="62"
					y="46"
					width="76"
					height="14"
					rx="4"
					fill="#fff8ec"
					stroke="currentColor"
					strokeWidth="2"
				/>
				{/* Eyes hidden by hat brim */}
				{/* Mouth (peaceful) */}
				<path
					d="M90 90 Q100 86 110 90"
					stroke="currentColor"
					strokeWidth="2"
					fill="none"
					strokeLinecap="round"
				/>
			</g>
			{/* Zzz floating */}
			{!isStatic && (
				<>
					<text
						x="140"
						y="42"
						fill="currentColor"
						fontSize="14"
						fontWeight="bold"
						opacity="0.6"
						style={{ animation: "bm-zzz 4s ease-out infinite" }}
					>
						z
					</text>
					<text
						x="148"
						y="32"
						fill="currentColor"
						fontSize="18"
						fontWeight="bold"
						opacity="0.5"
						style={{ animation: "bm-zzz 4s ease-out infinite 1.3s" }}
					>
						z
					</text>
					<text
						x="156"
						y="22"
						fill="currentColor"
						fontSize="22"
						fontWeight="bold"
						opacity="0.4"
						style={{ animation: "bm-zzz 4s ease-out infinite 2.6s" }}
					>
						z
					</text>
				</>
			)}
		</svg>
	);
}
