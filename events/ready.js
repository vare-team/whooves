import logger from '../utils/logger.js';
import { send } from '../services/webhook-log.js';
import error from './error.js';
import guildCreate from './guildCreate.js';
import guildDelete from './guildDelete.js';
import guildMemberAdd from './guildMemberAdd.js';
import guildMemberRemove from './guildMemberRemove.js';
import interactionCreate from './interactionCreate.js';
import messageCreate from './messageCreate.js';
import messageDelete from './messageDelete.js';
import messageDeleteBulk from './messageDeleteBulk.js';
import messageUpdate from './messageUpdate.js';
import voiceStateUpdate from './voiceStateUpdate.js';

/**
 *
 * @param client {Client}
 */
export default async function (client) {
	client.on('error', error);
	client.on('guildCreate', guildCreate);
	client.on('guildDelete', guildDelete);
	client.on('guildMemberAdd', guildMemberAdd);
	client.on('guildMemberRemove', guildMemberRemove);
	client.on('interactionCreate', interactionCreate);
	client.on('messageCreate', messageCreate);
	client.on('messageDelete', messageDelete);
	client.on('messageDeleteBulk', messageDeleteBulk);
	client.on('messageUpdate', messageUpdate);
	client.on('voiceStateUpdate', voiceStateUpdate);

	logger(`Shard ready!`, 'ShardingManager');
	await send('Shard ready!');
}
