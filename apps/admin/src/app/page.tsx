"use client";

import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default function SignInPage() {
	const [email, setEmail] = useState("");
	const [sent, setSent] = useState(false);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const res = await fetch(`${API}/v1/auth/magic/request`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, app: "admin" }),
			});

			if (!res.ok) {
				const text = await res.text().catch(() => "Request failed");
				throw new Error(text);
			}

			setSent(true);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="flex min-h-dvh items-center justify-center px-4">
			<div className="w-full max-w-sm">
				<h1 className="font-display text-4xl text-center text-meat mb-2">BUNMAN</h1>
				<p className="caps text-center text-ink-soft mb-8">Admin Panel</p>

				{sent ? (
					<div className="rounded-xl bg-paper-2 p-6 text-center">
						<p className="text-lg font-semibold mb-1">Check your email</p>
						<p className="text-ink-soft text-sm">
							We sent a magic link to <span className="font-medium text-ink">{email}</span>. Click
							it to sign in.
						</p>
					</div>
				) : (
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label htmlFor="email" className="caps block mb-2 text-ink-soft">
								Email address
							</label>
							<input
								id="email"
								type="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="you@bunman.com"
								className="w-full rounded-lg border border-rule bg-paper px-4 py-3 text-ink placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-meat"
							/>
						</div>

						{error && <p className="text-sm text-meat font-medium">{error}</p>}

						<button
							type="submit"
							disabled={loading}
							className="w-full rounded-lg bg-meat px-4 py-3 text-white font-semibold transition-colors hover:bg-meat-deep disabled:opacity-50"
						>
							{loading ? "Sending..." : "Send magic link"}
						</button>
					</form>
				)}
			</div>
		</div>
	);
}
