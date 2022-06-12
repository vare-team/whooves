import { Client } from 'discord.js'
import logger from './utils/logger.js'

const client = new Client({
	intents: [
		'GUILDS',
		'GUILD_MESSAGES',
		'GUILD_MEMBERS',
		'GUILD_VOICE_STATES'
	]
})

global.discordClient = client

client.login().then(() => logger('Bot authorized'))
