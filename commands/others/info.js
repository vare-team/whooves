import admins from '../../configs/admins.js';
import emojis from '../../configs/emojis.js';
import settings from '../../configs/settings.js';
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
import { respondSuccess } from '../../utils/respond-messages.js';
import Command from '../../utils/Command.js';
import Guild from '../../models/guild.js';

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

	const devs = await Promise.all(admins.map(x => client.users.fetch(x)));

	const fields = [
		{
			name: 'Статистика:',
			value: codeBlock(
				'c',
				//TODO add statistics
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
			value: devs.map(x => `${bold(x.tag)}`).join('\n'),
			inline: false,
		},
	];
	const embed = new EmbedBuilder().setAuthor({
		name: `${client.user.username} - информация о боте`,
		iconURL: client.user.displayAvatarURL(),
	});

	if (interaction.inGuild()) {
		const guild = await Guild.findByPk(interaction.guildId);

		fields.push({
			name: 'Настройки:',
			value:
				`Канал логирования: ${guild?.logchannel ? `<#${guild.logchannel}>` : emojis.error}\n` +
				`Фильтр плохих слов: ${bold(isPresent(guild?.settings, settings.badwords))}\n` +
				`Исправитель никнеймов: ${bold(isPresent(guild?.settings, settings.usernamechecker))}`,
			inline: true,
		});
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
