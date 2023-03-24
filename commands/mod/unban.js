import { respondError, respondSuccess } from '../../utils/respond-messages.js';
import { EmbedBuilder, PermissionsBitField, SlashCommandBuilder } from 'discord.js';
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
		.setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers),
	run
);

export async function run(interaction) {
	const user = interaction.options.getUser('user');
	const ban = await interaction.guild.bans.resolve(user.id);

	if (!user) return respondError(interaction, 'Пользователь не найден!');
	if (!ban) return respondError(interaction, 'Пользователь не забанен!');

	await interaction.guild.members
		.unban(user)
		.then(async () => {
			await respondSuccess(interaction, new EmbedBuilder().setDescription(`\`${user.tag}\` **был разбанен!**`));
		})
		.catch(async () => {
			await respondError(interaction, 'Не удалось разбанить!');
		});
}
