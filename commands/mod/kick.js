import { respondError, respondSuccess } from '../../utils/modules/respondMessages.js';
import { bold, EmbedBuilder, PermissionsBitField, SlashCommandBuilder } from 'discord.js';
import { generateErrLog } from '../../utils/logger.js';
import Command from '../../models/Command.js';

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
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers),
	run
);

export async function run(interaction) {
	const member = interaction.options.getMember('member');
	const reason = interaction.options.getString('reason') || 'Причина не указана';

	if (!member.kickable)
		return respondError(interaction, 'Я не могу кикнуть этого участника!\nЕго защитная магия превосходит мои умения!');

	const guild = interaction.guild.name;
	const moder = interaction.user.tag;
	await member
		.send(`Вы были кикнуты с сервера ${bold(guild)}, модератором ${bold(moder)}, по причине: ${reason}`)
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
