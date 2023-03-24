import { respondError, respondSuccess } from '../../utils/respond-messages.js';
import { ChannelType, EmbedBuilder, PermissionsBitField, SlashCommandBuilder } from 'discord.js';
import { sendLogChannel } from '../../services/guild-log.js';
import Command from '../../utils/Command.js';
import { setSettings } from '../../utils/settings-сontroller.js';

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
				.setDescription('channel for logs')
				.setNameLocalization('ru', 'логи')
				.setDescriptionLocalization('ru', 'канал для логов')
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
		.setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers),
	run
);

const normalizeParametrs = {
	bad_words: 'Фильтр плохих слов',
	autocorrector: 'Исправление никнеймов',
};

export async function run(interaction) {
	const badWords = interaction.options.getBoolean('bad_words');
	const autocorrector = interaction.options.getBoolean('autocorrector');
	const logs = interaction.options.getChannel('logs');
	const embed = new EmbedBuilder();
	const fields = [];

	if (badWords) {
		const [name, value] = await changeState('bad_words', badWords, interaction);
		if (!name && !value) return;

		fields.push({ name: name, value: value });
	}

	if (autocorrector) {
		const [name, value] = await changeState('autocorrector', autocorrector, interaction);
		if (!name && !value) return;

		fields.push({ name: name, value: value });
	}

	if (!logs) return respondSuccess(interaction, embed.addFields(fields));
	await sendLogChannel('commandUse', interaction.guild, {
		user: { tag: interaction.user.tag, id: interaction.user.id },
		channel: { id: interaction.channel.id },
		content: 'отключение лог-канала',
	});

	//TODO: бдшка
	//TODO: если сервака нет в бд, то над бы закинуть туда пустой
	//TODO: currentChannel - над бы взять из бд, какой сейчас установлен
	const state = logs.id !== currentChannel;
	client.userLib.db.update(`guilds`, { guildId: interaction.guildId, logchannel: state ? logs.id : null }, () => {});
	fields.push({
		name: 'Лог канал',
		value: !state ? `**отключен**!` : `<#${logs.id}> **установлен как канал для логов!**`,
	});

	return respondSuccess(interaction, embed.addFields(fields));
}

async function changeState(parameter, state, interaction) {
	//TODO: бдшка
	if (!(await setSettings(interaction.guildId, parameter, state))) {
		await respondError(interaction, 'Параметр уже находится в этом значении!');
		return [null, null];
	}
	return [normalizeParametrs[parameter], state ? 'включен' : 'выключен'];
}
