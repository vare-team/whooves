import { checkPermissions, respondError, respondSuccess } from '../../utils/respond-messages.js';
import { EmbedBuilder, PermissionFlagsBits, PermissionsBitField, SlashCommandBuilder } from 'discord.js';
import Command from '../../utils/Command.js';

export default new Command(
	new SlashCommandBuilder()
		.setName('unban')
		.setDescription('unbans user')
		.setNameLocalization('ru', 'снять_бан')
		.setDescriptionLocalization('ru', 'снимает бан с пользователя')
		.addUserOption(option =>
			option
				.setName('user')
				.setDescription('user to unban')
				.setNameLocalization('ru', 'пользователь')
				.setDescriptionLocalization('ru', 'пользователь которого надо разбанить')
				.setRequired(true)
		)
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
	run
);

async function run(interaction) {
	const check = checkPermissions(interaction, PermissionFlagsBits.BanMembers);
	if (check) return;

	await interaction.deleteReply();

	const user = interaction.options.getUser('user');
	const ban = await interaction.guild.bans.resolve(user.id);
	if (!ban) return respondError(interaction, 'Пользователь не забанен!');

	try {
		await interaction.guild.members.unban(user);
		return respondSuccess(interaction, new EmbedBuilder().setDescription(`\`${user.tag}\` **был разбанен!**`));
	} catch (error) {
		return respondError(interaction, 'Не удалось разбанить!');
	}
}
