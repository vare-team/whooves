import { decrypt } from './modules/AESCryptor.js'

/**
 * @function
 * @param {string} log
 * @param {string} type
 * @param {string} emitter
 */
export default function(log = 'Clap one hand', emitter = 'unknown', type = 'Log') {
	const time = new Date(),
		text = `${('00' + time.getDate()).slice(-2) + '.' + ('00' + (time.getMonth() + 1)).slice(-2) + ' ' + ('00' + time.getHours()).slice(-2) + ':' + ('00' + time.getMinutes()).slice(-2) + ':' + ('00' + time.getSeconds()).slice(-2)} | Shard[${0}] | {${emitter}} : ${log}`

	if (type === 'Error') return console.error(text)
	if (type === 'Warning') return console.warn(text)
	console.log(text)
}

/**
 * @function
 * @param {object} interaction
 * @return {string}
 */
export function generateUseLog(interaction) {
	console.log(interaction)
	switch (interaction.type) {
		case 'APPLICATION_COMMAND':
			return `Use: ${interaction.commandName}, By: @${interaction.user.username}#${interaction.user.discriminator}(${interaction.user.id}), ${
				interaction.guildId !== undefined ? `Guild ID: ${interaction.guildId}` : 'DM'
			} => #${interaction.channelId}`;

		case 'MESSAGE_COMPONENT':
			return `Interaction: ${interaction.commandName}, By: @${interaction.user.username}#${interaction.user.discriminator}(${interaction.user.id}), ${
				interaction.guildId !== undefined ? `Guild ID: ${interaction.guildId}` : 'DM'
			} => ${interaction.channelId}, custom_id: "${interaction['customId']}"(${decrypt(
				interaction['customId']
			)})`;
	}
}

/**
 * @function
 * @param {boolean} inGuild
 * @param {string} command
 * @param {object} interaction
 * @param {string} err
 * @returns {string}
 */
export function generateErrLog(inGuild, command, interaction, err) {
	if (inGuild) return `Ошибка!\n! Команда - ${command}\n! Сервер: ${interaction.guild.name} (ID: ${interaction.guild.id})\n! Канал: ${interaction.channel.name} (ID: ${interaction.channel.id})\n! Пользователь: ${interaction.user.tag} (ID: ${interaction.user.id})\n! Текст ошибки: ${err}`;
	return `Ошибка!\n! Команда - ${command}\n! Пользователь: ${interaction.user.tag} (ID: ${interaction.user.id})\n! Текст ошибки: ${err}`;
}
