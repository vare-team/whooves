import { codeBlock, ContextMenuCommandBuilder, EmbedBuilder, ApplicationCommandType } from 'discord.js';
import { respondSuccess } from '../../utils/respond-messages.js';
import Command from '../../utils/Command.js';

export default new Command(
	new ContextMenuCommandBuilder()
		.setName('About')
		.setNameLocalization('ru', 'Информация')
		.setType(ApplicationCommandType.User),
	run
);

function run(interaction) {
	const member = interaction.targetMember;
	const targetUserAvatar = member.displayAvatarURL({ forceStatic: false });
	const fields = [
		{
			name: 'Дата регистрации:',
			value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`,
			inline: true,
		},
		{
			name: 'Дата присоединения к этой гильдии:',
			value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`,
			inline: true,
		},
	];

	if (member.user.flags.bitfield)
		fields.push({
			name: 'Значки',
			value: codeBlock(member.user.flags.toArray().toString()),
		});

	const embed = new EmbedBuilder()
		.setTimestamp()
		.setTitle(member.user.bot ? 'Бот' : 'Пользователь')
		.setAuthor({ name: member.user.tag, iconURL: targetUserAvatar })
		.addFields(fields)
		.setThumbnail(targetUserAvatar);

	respondSuccess(interaction, embed, true);
}
