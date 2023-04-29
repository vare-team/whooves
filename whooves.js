import { Client, GatewayIntentBits } from 'discord.js';
import ready from './events/ready.js';
import logger from './utils/logger.js';
import sendSdc from './services/send-sdc.js';
import presenceController from './services/presence-controller.js';
import { initializeDbModels } from './utils/db.js';

// ==== on server start functions
(async function initDb() {
	try {
		await initializeDbModels();
	} catch (e) {
		if (process.env.NODE_ENV !== 'test') {
			/* eslint-disable */
			console.log(e);
			console.log('COULD NOT CONNECT TO THE DB, retrying in 5 seconds');
			/* eslint-enable */
		}
		setTimeout(initDb, 5000);
	}
})();
// ====

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

process.on('message', m => {
	if (m === 'startPresence') {
		presenceController();
		setInterval(presenceController, 30e3);

		if (client.shard.ids[0] === 0 && process.env.SDC) {
			sendSdc();
			setInterval(sendSdc, 30 * 60e3);
		}
	}
});

client.once('ready', ready);

client.login().then(() => logger('Bot Authorized', 'core'));
