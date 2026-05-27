"use client";

import { setToken } from "@/lib/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

function VerifyInner() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [status, setStatus] = useState<"loading" | "denied" | "error">("loading");
	const [message, setMessage] = useState("Verifying your magic link...");

	useEffect(() => {
		const token = searchParams.get("token");
		if (!token) {
			setStatus("error");
			setMessage("No token provided.");
			return;
		}

		(async () => {
			try {
				const res = await fetch(`${API}/v1/auth/exchange`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ token }),
				});

				if (!res.ok) {
					throw new Error("Token exchange failed");
				}

				const data = (await res.json()) as {
					jwt: string;
					user: { role: string };
				};

				if (data.user.role !== "staff" && data.user.role !== "admin") {
					setStatus("denied");
					setMessage("Access denied. This panel is for staff and admin users only.");
					return;
				}

				setToken(data.jwt);
				router.replace("/orders");
			} catch {
				setStatus("error");
				setMessage("Verification failed. The link may have expired.");
			}
		})();
	}, [searchParams, router]);

	return (
		<div className="flex min-h-dvh items-center justify-center px-4">
			<div className="w-full max-w-sm text-center">
				<h1 className="font-display text-3xl text-meat mb-4">BUNMAN</h1>

				{status === "loading" && (
					<div className="space-y-3">
						<div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-rule border-t-meat" />
						<p className="text-ink-soft">{message}</p>
					</div>
				)}

				{status === "denied" && (
					<div className="rounded-xl bg-paper-2 p-6">
						<p className="text-lg font-semibold text-meat mb-1">Access Denied</p>
						<p className="text-ink-soft text-sm">{message}</p>
					</div>
				)}

				{status === "error" && (
					<div className="rounded-xl bg-paper-2 p-6">
						<p className="text-lg font-semibold text-meat mb-1">Error</p>
						<p className="text-ink-soft text-sm">{message}</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default function VerifyPage() {
	return (
		<Suspense
			fallback={
				<div className="flex min-h-dvh items-center justify-center">
					<div className="h-8 w-8 animate-spin rounded-full border-2 border-rule border-t-meat" />
				</div>
			}
		>
			<VerifyInner />
		</Suspense>
	);
}
