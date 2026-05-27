import { AdminNav } from "@/components/AdminNav";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
	return (
		<div className="min-h-dvh">
			<AdminNav />
			{/* Offset for sidebar on desktop, top bar on mobile */}
			<div className="pt-14 lg:pt-0 lg:pl-56">
				<div className="p-4 sm:p-6 lg:p-8">{children}</div>
			</div>
		</div>
	);
}
