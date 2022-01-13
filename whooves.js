import { Client } from 'discord.js'

const client = new Client({
		intents: [
			'GUILDS',
			'GUILD_MESSAGES',
			'GUILD_MEMBERS',
			'GUILD_VOICE_STATES'
		]
})

global.discordClient = client;

client.login().then(() => client.userLib.sendLog('Bot authorized'));
