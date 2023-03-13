import logger from '../utils/logger.js';
import { send } from '../utils/webhook.js';
import guildCreate from './guildCreate.js';
import guildDelete from './guildDelete.js';
import guildMemberAdd from './guildMemberAdd.js';
import interactionCreate from './interactionCreate.js';
import messageCreate from './messageCreate.js';
import messageDelete from './messageDelete.js';
import messageDeleteBulk from './messageDeleteBulk.js';
import messageUpdate from './messageUpdate.js';
import voiceStateUpdate from './voiceStateUpdate.js';
import startPresence from '../utils/startPresence.js';
import sendSdc from '../utils/sendSdc.js';

/**
 *
 * @param client {Client}
 */
export default async function (client) {
	client.on('guildCreate', guildCreate);
	client.on('guildDelete', guildDelete);
	client.on('guildMemberAdd', guildMemberAdd);
	client.on('interactionCreate', interactionCreate);
	client.on('messageCreate', messageCreate);
	client.on('messageDelete', messageDelete);
	client.on('messageDeleteBulk', messageDeleteBulk);
	client.on('messageUpdate', messageUpdate);
	client.on('voiceStateUpdate', voiceStateUpdate);

	startPresence(client);
	if (process.env.SDC) await sendSdc(client);

	logger(`Shard ready!`, 'ShardingManager');
	send('Shard ready!');
}
