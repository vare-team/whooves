import { MessageEmbed } from 'discord.js'
import colors from '../../models/colors.js'

export const help = {
	name: 'About',
	description: 'Общая информация о авторе сообщения',
}

export const command = {
	name: help.name,
	name_localizations: {
		'ru': 'Информация'
	},
	type: 2,
}

export async function run(interaction) {
	const embed = new MessageEmbed().setColor(colors.information).setTimestamp()

	embed.setTitle(interaction.targetUser.bot ? 'Бот' : 'Пользователь')

		.setAuthor(
			{
				name: interaction.targetUser.tag,
				iconURL: interaction.targetUser.displayAvatarURL({ dynamic: true })
			}
		)
		.addField(
			'Дата регистрации:',
			`<t:${Math.floor(interaction.targetUser.createdAt / 1000)}:R>`,
			true
		)
		.setThumbnail(interaction.targetUser.displayAvatarURL({ dynamic: true }))
		.addField(
			'Дата присоединения к этой гильдии:',
			`<t:${Math.floor(interaction.targetMember.joinedTimestamp / 1000)}:R>`,
			true
		)

	if (interaction.targetUser.flags.bitfield)
		embed.addField('Значки:', '```' + interaction.targetUser.flags.toArray() + '```')

	interaction.reply({ embeds: [embed], ephemeral: true })
}

export default {
	help,
	command,
	run
}
