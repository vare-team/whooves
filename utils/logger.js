/**
 * @function
 * @param {string} log
 * @param {string} type
 * @param {string} emitter
 * @param {number} shardId
 */
export default function (log = 'Clap one hand', emitter = 'unknown', type = 'Log', shardId = 0) {
	const time = new Date(),
		text = `${`${`00${time.getDate()}`.slice(-2)}.${`00${time.getMonth() + 1}`.slice(
			-2
		)} ${`00${time.getHours()}`.slice(-2)}:${`00${time.getMinutes()}`.slice(-2)}:${`00${time.getSeconds()}`.slice(
			-2
		)}`} | Shard[${discordClient?.shard.ids[0] ?? shardId}] | {${emitter.toUpperCase()}} : ${log}`;

	/* eslint-disable */
	if (type === 'Error') return console.error(text);
	if (type === 'Warning') return console.warn(text);
	console.log(text);
	/* eslint-enable */
}

/**
 * @function
 * @param {BaseInteraction} interaction
 * @return {string}
 */
export function generateUseLog(interaction) {
	if (interaction.isCommand()) {
		return `Use: ${interaction.commandName}, By: @${interaction.user.username}#${interaction.user.discriminator}(${
			interaction.user.id
		}), ${interaction.guildId ? `Guild ID: ${interaction.guildId}` : 'DM'} => #${interaction.channelId}`;
	}

	if (interaction.isMessageComponent()) {
		return `Interaction: ${interaction.message.interaction.commandName}, By: @${interaction.user.username}#${
			interaction.user.discriminator
		}(${interaction.user.id}), ${interaction.guildId ? `Guild ID: ${interaction.guildId}` : 'DM'} => ${
			interaction.channelId
		}, custom_id: "${interaction.customId}"`;
	}
}

/**
 * @function
 * @param {string} command
 * @param {object} interaction
 * @param {string} err
 * @returns {string}
 */
export function generateErrLog(command, interaction, err) {
	if (interaction.inGuild())
		return `Ошибка!\n! Команда - ${command}\n! Сервер: ${interaction.guild.name} (ID: ${interaction.guild.id})\n! Канал: ${interaction.channel.name} (ID: ${interaction.channel.id})\n! Пользователь: ${interaction.user.tag} (ID: ${interaction.user.id})\n! Текст ошибки: ${err}`;
	return `Ошибка!\n! Команда - ${command}\n! Пользователь: ${interaction.user.tag} (ID: ${interaction.user.id})\n! Текст ошибки: ${err}`;
}
