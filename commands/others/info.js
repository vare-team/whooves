import admins from '../../models/admins.js';
import dataBase from '../../services/dataBase.js';
import emojis from '../../models/emojis.js';
import settings from '../../models/settings.js';
import { createRequire } from 'module';
import {
	ActionRowBuilder,
	ButtonBuilder,
	SlashCommandSubcommandBuilder,
	ButtonStyle,
	codeBlock,
	bold,
	EmbedBuilder,
} from 'discord.js';
import { respondSuccess } from '../../utils/modules/respondMessages.js';
import Command from '../../models/Command.js';

const require = createRequire(import.meta.url);
const pkg = require('../../package.json');

export default new Command(
	new SlashCommandSubcommandBuilder()
		.setName('info')
		.setDescription('bot info')
		.setNameLocalization('ru', 'инфо')
		.setDescriptionLocalization('ru', 'информация о боте'),
	run
);

export const help = {
	name: 'info',
	description: 'Информация о боте',
};

export const command = {
	name: 'info',
	description: 'Информация о боте',
};

export async function run(interaction) {
	const client = interaction.client;
	const components = new ActionRowBuilder().setComponents([
		new ButtonBuilder()
			.setLabel('Github')
			.setStyle(ButtonStyle.Link)
			.setURL('https://github.com/vare-team/whooves')
			.setEmoji('🌀'),
		new ButtonBuilder()
			.setLabel('Сервер поддержки')
			.setStyle(ButtonStyle.Link)
			.setURL('https://discordapp.com/invite/8KKVhTU')
			.setEmoji('💬'),
	]);

	const devs = Object.keys(admins).map(async x => client.users.cache.get(x) || (await client.users.fetch(x)));

	const fields = [
		{
			name: 'Статистика:',
			value: codeBlock(
				'c',
				`Пинг:             ${Math.round(client.ws.ping)} ms\nКоманд исполнено: ${0}\nИз них ошибок:    ${0}`
			),
			inline: true,
		},
		{
			name: 'Зависимости:',
			value: codeBlock(
				'c',
				`Версия бота:    ${pkg.version}\n` +
					`Discord.js:     ${pkg.dependencies['discord.js']}\n` +
					`Версия Node:    ${process.version.replace("'v'", " ''")}`
			),
			inline: true,
		},
		{
			name: 'Разработчики:',
			value: devs.map(x => `${bold(x.tag)}\n`).join('\n'),
			inline: false,
		},
	];
	const embed = new EmbedBuilder().setAuthor({
		name: `${client.user.username} - информация о боте`,
		iconURL: client.user.displayAvatarURL(),
	});

	if (interaction.inGuild()) {
		/*let data = await client.userLib.db
			.promise()
			.query('SELECT logchannel, settings FROM guilds WHERE guildId = ?', [interaction.guildId]);*/

		let data = await dataBase.query('SELECT logchannel, settings FROM guilds WHERE guildId = ?', [interaction.guildId]);

		data = data[0][0];
		fields.push([
			{
				name: 'Настройки:',
				value:
					`Канал логирования: ${data.logchannel ? `<#${data.logchannel}>` : emojis.error}` +
					`Фильтр плохих слов: ${bold(isPresent(data.settings, settings.badwords))`Исправитель никнеймов: `}${bold(
						isPresent(data.settings, settings.usernamechecker)
					)}`,
				inline: true,
			},
		]);
	}

	embed.addFields(fields);

	await respondSuccess(interaction, embed, false, [components]);
}

/**
 * @param settings {number}
 * @param parameter {number}
 * @returns {string}
 */
function isPresent(settings, parameter) {
	return settings & parameter ? emojis.ready : emojis.error;
}
