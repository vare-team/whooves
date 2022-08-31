import {boldText, cBlock} from "../../utils/functions.js";
import {MessageActionRow, MessageButton, MessageEmbed} from "discord.js";
import colors from "../../models/colors.js";
import admins from "../../models/admins.js";
import pkg from '../../package.json' assert {type: "json"};
import dataBase from "../../services/dataBase.js";
import emojis from "../../models/emojis.js";
import settings from "../../models/settings.js";

export const help = {
	name: 'info',
	description: 'Информация о боте',
};

export const command = {
	name: 'info',
	description: 'Информация о боте',
};

export async function run (interaction) {
	const client = interaction.client;
	const row = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setLabel('Github')
				.setStyle('LINK')
				.setURL('https://github.com/vare-team/whooves')
				.setEmoji('🌀'),
			new MessageButton()
				.setLabel('Сервер поддержки')
				.setStyle('LINK')
				.setURL('https://discordapp.com/invite/8KKVhTU')
				.setEmoji('💬')
		);

	let devs = Object.keys(admins).map(async x => client.users.cache.get(x) || (await client.users.fetch(x)))

	let fields = [
		{
			name: 'Статистика:',
			value: cBlock((
				`Пинг:             ${Math.round(client.ws.ping)} ms\n` +
				`Команд исполнено: ${0}\n` +
				`Из них ошибок:    ${0}`
			)),
			inline: true
		},
		{
			name: 'Зависимости:',
			value: cBlock((
				`Версия бота:    ${pkg.version}\n` +
				`Discord.js:     ${pkg.dependencies["discord.js"]}\n` +
				`Версия Node:    ${process.version.replace("\'v\'", " \'\'")}`
			)),
			inline: true
		},
		{
			name: 'Разработчики:',
			value: devs.map(x => boldText(x.tag) + '\n').join('\n'),
			inline: false
		},
	]
	const embed = new MessageEmbed()
		.setAuthor({
			name: client.user.username + ' - информация о боте',
			iconURL: client.user.displayAvatarURL()
		})
		.setColor(colors.information)
		.addFields(fields)

	if (interaction.inGuild()) {
		/*let data = await client.userLib.db
			.promise()
			.query('SELECT logchannel, settings FROM guilds WHERE guildId = ?', [interaction.guildId]);*/

		let data = await dataBase.query('SELECT logchannel, settings FROM guilds WHERE guildId = ?', [interaction.guildId]);

		data = data[0][0];
		embed.addFields([{
				name: 'Настройки:',
				value:
					`Канал логирования: ${data.logchannel ? `<#${data.logchannel}>` : emojis.error}` +
					`Фильтр плохих слов: ` + boldText(isPresent(data.settings, settings.badwords))
					`Исправитель никнеймов: ` + boldText(isPresent(data.settings, settings.usernamechecker)),
				inline: true
			}]
		);
	}

	interaction.reply({embeds: [embed], components: [row]})
}

/**
 * @param settings {number}
 * @param parameter {number}
 * @returns {string}
 */
function isPresent(settings, parameter){
	return settings & parameter ? emojis.ready : emojis.error
}

export default {
	help,
	command,
	run
}
