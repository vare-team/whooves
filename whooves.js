import { Client, GatewayIntentBits } from 'discord.js';
import ready from './events/ready.js';
import logger from './utils/logger.js';
import interactionCreate from './events/interactionCreate.js';

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildBans,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

global.discordClient = client;

client.login().then(() => logger('Bot authorized', 'core'));

client.once('ready', ready);
client.on('interactionCreate', interactionCreate);
