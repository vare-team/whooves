import { MessageEmbed } from 'discord.js';
import colors from '../../models/colors.js';

export const help = {
	name: 'About',
	description: 'Общая информация о авторе сообщения',
};

export const command = {
	name: help.name,
	name_localizations: {
		ru: 'Информация',
	},
	type: 2,
};

export async function run(interaction) {
	const embed = new MessageEmbed().setColor(colors.information).setTimestamp()
	let targetUserAvatar = interaction.targetUser.displayAvatarURL({dynamic: true});
	let fields = [
		{
			name: 'Дата регистрации:',
			value: `<t:${Math.floor(interaction.targetUser.createdAt / 1000)}:R>`,
			inline: true
		},
		{
			name: 'Дата присоединения к этой гильдии:',
			value: `<t:${Math.floor(interaction.targetMember.joinedTimestamp / 1000)}:R>`,
			inline: true
		}
	]

	if (interaction.targetUser.flags.bitfield)
		fields.push({
				name: 'Значки',
				value: '```' + interaction.targetUser.flags.toArray() + '```'
			}
		)

	embed
		.setTitle(interaction.targetUser.bot ? 'Бот' : 'Пользователь')
		.setAuthor(
			{
				name: interaction.targetUser.tag,
				iconURL: targetUserAvatar
			}
		)
		.addFields(fields)
		.setThumbnail(targetUserAvatar)

	interaction.reply({embeds: [embed], ephemeral: true})
}

export default {
	help,
	command,
	run,
};
