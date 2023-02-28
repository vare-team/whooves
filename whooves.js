import { Client } from 'discord.js';
import ready from './events/ready.js';
import logger from './utils/logger.js';
import interactionCreate from './events/interactionCreate.js';

const client = new Client({
	intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_VOICE_STATES'],
});

global.discordClient = client;

client.login().then(() => logger('Bot authorized', 'core'));

client.once('ready', ready);
client.on('interactionCreate', interactionCreate);
