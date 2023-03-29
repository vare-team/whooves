import { respondSuccess } from '../../utils/respond-messages.js';
import { ChannelType, EmbedBuilder, PermissionsBitField, SlashCommandBuilder } from 'discord.js';
import { sendLogChannel } from '../../services/guild-log.js';
import Command from '../../utils/Command.js';
import { getSetting } from '../../utils/settings-сontroller.js';
import Guild from '../../models/guild.js';

const states = [
	{ name: 'On', name_localizations: { ru: 'Вкл' }, value: 'true' },
	{ name: 'Off', name_localizations: { ru: 'Откл' }, value: 'false' },
];

export default new Command(
	new SlashCommandBuilder()
		.setName('settings')
		.setDescription('bot setting')
		.setNameLocalization('ru', 'настройки')
		.setDescriptionLocalization('ru', 'настройки бота')
		.addChannelOption(option =>
			option
				.setName('logs')
				.setDescription('channel for logs (send current for off)')
				.setNameLocalization('ru', 'логи')
				.setDescriptionLocalization('ru', 'канал для логов (указать текущий для отключения)')
				.addChannelTypes(ChannelType.GuildText)
				.setRequired(false)
		)
		.addStringOption(option =>
			option
				.setName('bad_words')
				.setDescription('filter of bad words')
				.setNameLocalization('ru', 'фильтр_слов')
				.setDescriptionLocalization('ru', 'Фильтр плохих слов в чате')
				.setChoices(...states)
				.setRequired(false)
		)
		.addStringOption(option =>
			option
				.setName('autocorrector')
				.setDescription('user nickname autocorrector')
				.setNameLocalization('ru', 'корректор_ников')
				.setDescriptionLocalization('ru', 'Проверка никнейма участнкиа при его заходе')
				.setChoices(...states)
				.setRequired(false)
		)
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
	run
);

async function run(interaction) {
	const badWords = interaction.options.getString('bad_words');
	const autocorrector = interaction.options.getString('autocorrector');
	const logs = interaction.options.getChannel('logs');
	const embed = new EmbedBuilder().setTitle('🔧 Настройки');
	const fields = [];

	const guild = await Guild.findByPk(interaction.guildId);
	const settings = { id: interaction.guildId, settings: guild?.settings ?? 0, logChannel: guild?.logChannel ?? null };

	if (badWords !== null) settings.settings += await getSetting(fields, guild, 'chatAutoModeration', badWords);
	if (autocorrector !== null)
		settings.settings += await getSetting(fields, guild, 'nicknameAutoModeration', autocorrector);

	if (logs !== null) {
		const isCurrent = logs.id === guild?.logChannel;
		settings.logChannel = isCurrent ? null : logs.id;

		if (isCurrent) {
			await sendLogChannel('commandUse', interaction.guild, {
				user: { tag: interaction.user.tag, id: interaction.user.id },
				channel: { id: interaction.channel.id },
				content: 'отключение лог-канала',
			});
		}

		fields.push({
			name: 'Лог канал',
			value: isCurrent ? `**отключен**!` : `<#${logs.id}> **установлен как канал для логов!**`,
		});
	}

	await Guild.upsert(settings);
	return respondSuccess(interaction, [embed.addFields(fields)]);
}
