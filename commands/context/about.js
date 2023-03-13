import { codeBlock, ContextMenuCommandBuilder, EmbedBuilder, ApplicationCommandType } from 'discord.js';
import { respondSuccess } from '../../utils/modules/respondMessages.js';
import Command from '../../models/Command.js';

export default new Command(
	new ContextMenuCommandBuilder()
		.setName('About')
		.setNameLocalization('ru', 'Информация')
		.setType(ApplicationCommandType.User),
	run
);

function run(interaction) {
	const member = interaction.targetMember ? interaction.targetMember : interaction.targetUser;
	const targetUserAvatar = member.displayAvatarURL({ dynamic: true });
	const embed = new EmbedBuilder().setTimestamp();
	const fields = [
		{
			name: 'Дата регистрации:',
			value: `<t:${Math.floor(member.createdAt / 1000)}:R>`,
			inline: true,
		},
		{
			name: 'Дата присоединения к этой гильдии:',
			value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`,
			inline: true,
		},
	];

	if (member.flags.bitfield)
		fields.push({
			name: 'Значки',
			value: codeBlock(member.flags.toArray().toString()),
		});

	embed
		.setTitle(member.bot ? 'Бот' : 'Пользователь')
		.setAuthor({
			name: member.tag,
			iconURL: targetUserAvatar,
		})
		.addFields(fields)
		.setThumbnail(targetUserAvatar);

	return respondSuccess(interaction, embed, true);
}
