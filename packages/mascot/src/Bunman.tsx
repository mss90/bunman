import { Angry } from "./poses/Angry";
import { Empty } from "./poses/Empty";
import { Idle } from "./poses/Idle";
import { Proud } from "./poses/Proud";
import { Sleeping } from "./poses/Sleeping";
import { Smashing } from "./poses/Smashing";

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
