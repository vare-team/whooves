import { respondError, respondSuccess } from '../../utils/respond-messages.js';
import { bold, EmbedBuilder, PermissionsBitField, SlashCommandBuilder } from 'discord.js';
import { generateErrLog } from '../../utils/logger.js';
import Command from '../../utils/Command.js';
import Warn from '../../models/warn.js';

export default new Command(
	new SlashCommandBuilder()
		.setName('kick')
		.setDescription('kick member')
		.setNameLocalization('ru', 'кик')
		.setDescriptionLocalization('ru', 'кикает участника')
		.addUserOption(option =>
			option
				.setName('member')
				.setDescription('member to kick')
				.setNameLocalization('ru', 'участник')
				.setDescriptionLocalization('ru', 'участник которого нужно кикнуть')
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName('reason')
				.setDescription('reason to kick')
				.setNameLocalization('ru', 'причина')
				.setDescriptionLocalization('ru', 'причина для кика')
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
		.setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers),
	run
);

async function run(interaction) {
	const member = interaction.options.getMember('member');
	const reason = interaction.options.getString('reason') || 'Причина не указана';
	const force = interaction.options.getString('force') === 'true';

	if (!member?.kickable)
		return respondError(interaction, 'Я не могу кикнуть этого участника!\nЕго защитная магия превосходит мои умения!');

	if (!force) {
		const warns = await Warn.count({ where: { userId: member.id, guildId: interaction.guildId } });

		if (warns < 3)
			return await respondError(
				interaction,
				'Чтоб выгнать участника необходимо **3** предупреждения!\nИли используйте аргумент `force`.'
			);
	}

	if (force && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
		await respondError(interaction, 'Аргумент ``-force`` доступен только администраторам!');
		return;
	}

	await interaction.deferReply();
	await member
		.send(
			`Вы были кикнуты с сервера ${bold(interaction.guild.name)}, модератором ${bold(
				interaction.user.tag
			)}, по причине: ${reason}`
		)
		.catch(() =>
			generateErrLog(
				'kick',
				interaction,
				`DM Send catch! Guild ${interaction.guild.name} (ID:${interaction.guildId}), @${member.tag} (ID:${member.id})`
			)
		);

	await member.kick(`${interaction.user.tag}: ${reason}`);
	await respondSuccess(interaction, new EmbedBuilder().setDescription(`${member} **был кикнут!** ***||*** ${reason}`));
}
