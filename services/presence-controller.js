import { ActivityType } from 'discord.js';

let presence = 1;

export default async function () {
	if (presence === 1) {
		discordClient.user.setActivity('/info', { type: ActivityType.Watching });
	} else if (presence === 2) {
		const guilds = await discordClient.shard.fetchClientValues('guilds.cache.size');
		discordClient.user.setActivity(`серверов: ${guilds.reduce((p, v) => p + v, 0)} | /help`, {
			type: ActivityType.Watching,
		});
	} else if (presence === 3) {
		discordClient.user.setActivity('время', { type: ActivityType.Watching });
	} else if (presence === 4) {
		discordClient.user.setActivity('хуффингтон', { type: ActivityType.Streaming });
		presence = 0;
	}
	presence++;
}
