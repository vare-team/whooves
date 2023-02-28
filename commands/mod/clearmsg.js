import { MessageEmbed } from 'discord.js';
import colors from "../../models/colors.js";

export const help = {
	name: 'clearmsg',
	description: 'Очистить сообщения',
};

export const command = {
	name: help.name,
	description: help.description,
	options: [
		{
			name: 'количество',
			description: 'Количество сообщений (не более 100 за раз)',
			type: 4,
			required: true,
			min_value: 1,
			max_value: 99
		},
		{
			name: 'участник',
			description: 'Удалить только сообщения от участника',
			type: 6,
		},
	],
};

export async function run (interaction) {
	let dmsg = await interaction.channel.bulkDelete(interaction.options.getInteger('количество'), true);

	let embed = new MessageEmbed()
		.setColor(colors.success)
		.setTitle('Удаление сообщений')
		.setDescription(`Сообщения были удалены (**${dmsg.size}**)!`)
		.setTimestamp();

	interaction.editReply({ embeds: [embed] });
}

export default {
	help,
	command,
	run
}
