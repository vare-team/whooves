import { checkPermissions, respondError, respondSuccess } from '../../utils/respond-messages.js';
import { bold, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import logger, { generateErrLog } from '../../utils/logger.js';
import Command from '../../utils/Command.js';
import Warn from '../../models/warn.js';

export default new Command(
	new SlashCommandBuilder()
		.setName('ban')
		.setDescription('ban user')
		.setNameLocalization('ru', 'бан')
		.setDescriptionLocalization('ru', 'банит пользователя')
		.addUserOption(option =>
			option
				.setName('user')
				.setDescription('user to ban')
				.setNameLocalization('ru', 'пользователь')
				.setDescriptionLocalization('ru', 'пользователь которого надо забанить')
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName('reason')
				.setDescription('reason of ban')
				.setNameLocalization('ru', 'причина')
				.setDescriptionLocalization('ru', 'причина бана')
				.setRequired(false)
		)
		.addIntegerOption(option =>
			option
				.setName('clear_seconds')
				.setDescription('number of seconds to delete messages for')
				.setNameLocalization('ru', 'очстка_секунды')
				.setDescriptionLocalization('ru', 'кол-во секунд за которые нужно очистить сообщения')
				.setMinValue(0)
				.setMaxValue(604800)
				.setRequired(false)
		)
		.addStringOption(option =>
			option
				.setName('force')
				.setDescription('force ban ignore warns count')
				.setNameLocalization('ru', 'принудительно')
				.setDescriptionLocalization('ru', 'принудительный бан игнорируя кол-во варнов')
				.setChoices(
					{ name: 'True', name_localizations: { ru: 'Да' }, value: 'true' },
					{ name: 'False', name_localizations: { ru: 'Нет' }, value: 'false' }
				)
				.setRequired(false)
		)
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
	run
);

async function run(interaction) {
	const check = checkPermissions(interaction, PermissionFlagsBits.BanMembers);
	if (check) return;

	const member = interaction.options.getMember('user');
	const user = interaction.options.getUser('user');
	const clearmsg = interaction.options.getInteger('clear_seconds') ?? 0;
	const reason = interaction.options.getString('причина') ?? 'Причина не указана';
	const force = interaction.options.getString('force') === 'true';

	if (member && !member.bannable)
		return await respondError(
			interaction,
			'Я не могу забанить этого участника!\nЕго защитная магия превосходит мои умения!'
		);

	if (!force) {
		const warns = await Warn.count({ where: { userId: user.id, guildId: interaction.guildId } });

		if (warns < 5) {
			await respondError(interaction, 'Для выдачи бана необходимо **5** варнов!\nИли используйте аргумент `force`.');
			return;
		}
	}

	if (force && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
		await respondError(interaction, 'Аргумент ``-force`` доступен только администраторам!');
		return;
	}

	await user
		.send(
			`Вам был выдан бан на сервере ${bold(interaction.guild.name)}, модератором ${bold(
				interaction.user.tag
			)}, по причине: ${reason}`
		)
		?.catch(e => logger(generateErrLog('ban', interaction, e)));

	await interaction.guild.members.ban(user, {
		reason: `${interaction.user.tag}: ${reason}`,
		deleteMessageSeconds: clearmsg,
	});

	await respondSuccess(interaction, [new EmbedBuilder().setDescription(`${user} **был забанен!** ***||*** ${reason}`)]);
}
