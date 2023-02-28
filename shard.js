import { ShardingManager } from 'discord.js';
import logger from './utils/logger.js';

const manager = new ShardingManager('./whooves.js', { token: process.env.TOKEN });

manager.spawn().then(() => logger('Spawned!', 'ShardingManager', 'Log'));

manager.on('shardCreate', () => logger('Launched!', 'ShardingManager', 'Log'));
