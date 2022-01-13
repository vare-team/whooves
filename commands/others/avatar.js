import { MessageEmbed } from "discord.js";
import colors from "../../models/colors";

export const help = {
	name: 'avatar',
	description: 'Ссылка на аватара пользователя',
}

export const command = {
	name: help.name,
	description: help.description,
	options: [
		{
			name: 'пользователь',
			description: 'пользователь',
			type: 6,
		},
	],
}

export function run(interaction) {
	const user = interaction.options.getUser('пользователь') || interaction.user

	let embed = new MessageEmbed()
		.setDescription(`Аватар ${user}`)
		.setColor(colors.information)
		.setImage(user.displayAvatarURL({ dynamic: true, size: 2048 }))
		.setTimestamp()

	if (user.avatar && user.avatar.startsWith('a_')) embed.setFooter('GIF')

	interaction.reply({ embeds: [embed], ephemeral: !interaction.options.getUser('пользователь') })
}

export default {
	help,
	command,
	run
}
