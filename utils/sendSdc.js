import manager from '../shard.js';
import { post } from 'axios';

let started = false;
/**
 *
 * @return {Promise<*>}
 */
export default async function (client) {
	if (started) return;
	started = true;

	const url = `https://api.server-discord.com/v2/bots/${client.id}/stats`;
	const shards = manager.shards.size;
	const guilds = manager.fetchClientValues('guilds.cache.size');

	await post(url, {
		shards: shards && shards >= 1 ? shards : 1,
		servers: guilds && guilds >= 1 ? guilds : 1,
		Authorization: `SDC ${process.env.SDC}`,
	});
}
