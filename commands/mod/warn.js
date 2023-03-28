import { bold, EmbedBuilder, PermissionsBitField, SlashCommandBuilder } from 'discord.js';
import { respondSuccess } from '../../utils/respond-messages.js';
import Command from '../../utils/Command.js';
import { sendLogChannel } from '../../services/guild-log.js';
import Warn from '../../models/warn.js';

export default new Command(
	new SlashCommandBuilder()
		.setName('warn')
		.setDescription('add warn to user')
		.setNameLocalization('ru', 'выдать_варн')
		.setDescriptionLocalization('ru', 'Выдать варн пользователю')
		.addUserOption(option =>
			option
				.setName('user')
				.setDescription('user to warn')
				.setNameLocalization('ru', 'пользователь')
				.setDescriptionLocalization('ru', 'пользователь которому надо выдать')
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName('reason')
				.setDescription('reason of warning')
				.setNameLocalization('ru', 'причина')
				.setDescriptionLocalization('ru', 'причина варна')
				.setMinLength(1)
				.setMaxLength(300)
				.setRequired(false)
		)
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionsBitField.Flags.ModerateMembers),
	run
);

async function run(interaction) {
	const user = interaction.options.getUser('user');
	const reason = interaction.options.getString('reason') ?? 'Не указана';

	await interaction.deleteReply();
	const warn = await Warn.create({
		userId: user.id,
		guildId: interaction.guildId,
		whoId: interaction.user.id,
		reason: reason === 'Не указана' ? null : reason,
	});
	const warnCount = await Warn.count({ where: { userId: user.id, guildId: interaction.guildId } });

	const embed = new EmbedBuilder()
		.setTitle(`${user.tag} выдано предупреждение!`)
		.setDescription(
			`Причина: ${bold(reason)}\nВсего предупреждений: ${bold(warnCount)}\nID предупреждения: ${bold(warn.id)}`
		)
		.setTimestamp();

	await respondSuccess(interaction, embed);
	await sendLogChannel('commandUse', interaction.guild, {
		user: { tag: interaction.user.tag, id: interaction.user.id },
		channel: { id: interaction.channelId },
		content: `выдача предупреждения (ID: ${warn.res}) ${user.id} по причине: ${reason}`,
	});
}
