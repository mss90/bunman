import { Angry } from "./poses/Angry.js";
import { Empty } from "./poses/Empty.js";
import { Idle } from "./poses/Idle.js";
import { Proud } from "./poses/Proud.js";
import { Sleeping } from "./poses/Sleeping.js";
import { Smashing } from "./poses/Smashing.js";

export type BunmanPose = "idle" | "smashing" | "angry" | "proud" | "sleeping" | "empty";

interface BunmanProps {
	pose?: BunmanPose;
	size?: number;
	className?: string;
	static?: boolean;
}

const poses = {
	idle: Idle,
	smashing: Smashing,
	angry: Angry,
	proud: Proud,
	sleeping: Sleeping,
	empty: Empty,
} as const;

export function Bunman({ pose = "idle", size = 120, className, static: isStatic }: BunmanProps) {
	const Pose = poses[pose];

	return (
		<div className={className} style={{ width: size, height: size }}>
			<Pose size={size} static={isStatic} />
		</div>
	);
}
