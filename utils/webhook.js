import { WebhookClient } from "discord.js";

const webHook = new WebhookClient(
	process.env.webhookId,
	process.env.webhookToken
);

/**
 * @function
 * @param {string} content
 */
export const send = (content = 'Clap one hand') => {
	if (webhook) return;

	const now = new Date();

	webhook.send(`<t:${Math.floor(now.getTime() / 1000)}:T> | Shard[${client.shard.ids}] | : ${content}`);
};
