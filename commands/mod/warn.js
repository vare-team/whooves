import { bold, EmbedBuilder, PermissionsBitField, SlashCommandBuilder } from 'discord.js';
import { respondSuccess } from '../../utils/modules/respondMessages.js';
import promise from '../../utils/promise.js';
import Command from '../../models/Command.js';
import { sendLogChannel } from '../../utils/modules/guildLog.js';

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
				.setRequired(true)
		)
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionsBitField.Flags.ModerateMembers),
	run
);

export async function run(interaction) {
	const user = interaction.options.getString('user');
	const reason = interaction.options.getString('reason') || 'Не указана';

	//TODO: бдшка
	const warn = await promise(client.userLib.db, client.userLib.db.insert, 'warns', {
			userId: user.id,
			guildId: interaction.guildId,
			who: interaction.user.id,
			reason: reason,
		}),
		warnInfo = await promise(
			client.userLib.db,
			client.userLib.db.queryValue,
			'SELECT COUNT(*) FROM warns WHERE userId = ? AND guildId = ?',
			[user.id, interaction.guildId]
		);

	const embed = new EmbedBuilder()
		.setTitle(`${user.tag} выдано предупреждение!`)
		.setDescription(
			`Причина: ${bold(reason)}\nВсего предупреждений: ${bold(warnInfo.res)}\nID предупреждения: ${bold(warn.res)}`
		)
		.setTimestamp();

	await respondSuccess(interaction, embed);

	await sendLogChannel('commandUse', interaction.guild, {
		user: { tag: interaction.user.tag, id: interaction.user.id },
		channel: { id: interaction.channelId },
		content: `выдача предупреждения (ID: ${warn.res}) ${user.id} по причине: ${reason}`,
	});
}
