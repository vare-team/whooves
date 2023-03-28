import { ShardingManager, fetchRecommendedShardCount } from 'discord.js';
import logger from './utils/logger.js';

const manager = new ShardingManager('./whooves.js', { token: process.env.TOKEN });
global.discordClient = null;

manager.on('shardCreate', shard => logger('Shard spawned!', 'ShardingManager', 'Log', shard.id));

(async () => {
	const amount = await fetchRecommendedShardCount(process.env.TOKEN, { guildsPerShard: 1000 });
	logger(`Shards count: ${amount}`, 'ShardingManager');

	manager.shardList = [...Array(amount).keys()];
	manager.totalShards = amount;

	// Spawn the shards
	const promises = [];
	for (let i = 0; i < amount; i++) promises.push(manager.createShard(i).spawn(5 * 60e3));
	const shards = await Promise.all(promises);

	for (const shard of shards) shard.send('startPresence');
})();
