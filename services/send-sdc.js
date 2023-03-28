import axios from 'axios';

const sdc = axios.create({
	baseURL: 'https://api.server-discord.com/v2/bots',
	headers: { Authorization: `SDC ${process.env.SDC}` },
});

export default async function () {
	const shards = discordClient.shard.count;
	const guilds =
		discordClient.shard.fetchClientValues('guilds.cache.size')?.reduce((p, c) => p + c, 0) ??
		discordClient.guilds.cache.size;

	await sdc.post(`${discordClient.id}/stats`, { shards: shards ?? 1, servers: guilds ?? 1 });
}
