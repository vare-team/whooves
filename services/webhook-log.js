import { WebhookClient } from 'discord.js';

const webhook = new WebhookClient({ url: process.env.WEBHOOK_URL });

/**
 * @function
 * @param {string} content
 */
export function send(content = 'Clap one hand') {
	if (process.env.NODE_ENV !== 'production') return;
	const now = new Date();

	return webhook.send(
		`<t:${Math.floor(now.getTime() / 1000)}:T> | Shard[${discordClient.shard.ids[0]}] | : ${content}`
	);
}
