import { WebhookClient } from 'discord.js';

const webHook = new WebhookClient(process.env.WEBHOOK_URL);

/**
 * @function
 * @param {string} content
 */
export function send(content = 'Clap one hand') {
	if (webHook) return;

	const now = new Date();

	return webHook.send(`<t:${Math.floor(now.getTime() / 1000)}:T> | Shard[${client.shard.ids}] | : ${content}`);
}
