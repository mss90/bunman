"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
	const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
	const [dismissed, setDismissed] = useState(false);

	useEffect(() => {
		const handler = (e: Event) => {
			e.preventDefault();
			setDeferredPrompt(e as BeforeInstallPromptEvent);
		};

		window.addEventListener("beforeinstallprompt", handler);
		return () => window.removeEventListener("beforeinstallprompt", handler);
	}, []);

	if (!deferredPrompt || dismissed) return null;

	const install = async () => {
		await deferredPrompt.prompt();
		const result = await deferredPrompt.userChoice;
		if (result.outcome === "accepted") {
			setDeferredPrompt(null);
		}
		setDismissed(true);
	};

	return (
		<div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm rounded-xl border border-rule bg-paper p-4 shadow-lg md:left-auto md:right-6">
			<p className="text-sm font-semibold text-ink">Add BUNMAN to your home screen</p>
			<p className="mt-1 text-xs text-ink-soft">Order faster. Skip the browser.</p>
			<div className="mt-3 flex gap-2">
				<button
					type="button"
					onClick={install}
					className="rounded-full bg-meat px-4 py-2 text-xs font-semibold text-paper transition-colors hover:bg-meat-deep"
				>
					Install
				</button>
				<button
					type="button"
					onClick={() => setDismissed(true)}
					className="rounded-full px-4 py-2 text-xs text-ink-soft hover:text-ink"
				>
					Not now
				</button>
			</div>
		</div>
	);
}
