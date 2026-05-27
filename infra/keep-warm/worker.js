export default {
	async scheduled(event, env, ctx) {
		const url = "https://bunman-api.onrender.com/v1/health";
		try {
			const res = await fetch(url);
			const data = await res.json();
			console.log("Keep-warm ping:", JSON.stringify(data));
		} catch (err) {
			console.error("Keep-warm failed:", err.message);
		}
	},
	async fetch(request, env, ctx) {
		return new Response("BUNMAN keep-warm worker.", { status: 200 });
	},
};
