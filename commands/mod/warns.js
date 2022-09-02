import {MessageEmbed} from "discord.js";
import colors from "../../models/colors.js";

export const help = {
	name: 'warns',
	description: 'Количество предупреждений',
};

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
};

export async function run (interaction) {
	const user = interaction.options.getUser('пользователь') || interaction.user;

	let warns = await client.userLib.db
		.promise()
		.query('SELECT * FROM warns WHERE userId = ? AND guildId = ?', [user.id, interaction.guildId]);
	warns = warns[0];

	let embed = new MessageEmbed()
		.setColor(colors.information)
		.setAuthor({
			name: user.username + '#' + user.discriminator,
			iconURL:  user.displayAvatarURL()
		})
		.setTitle('Предупреждения')
		.setTimestamp();

	let descGenerator = `Количество предупреждений: **${warns.length}**\n\n`;
	for (const warn of warns)
		descGenerator += `(ID: **${warn.warnId}**); <@!${warn.who}>: ${warn.reason ?? 'Не указана'}\n`;
	embed.setDescription(descGenerator);

	interaction.reply({ embeds: [embed], ephemeral: true });
}

export default {
	help,
	command,
	run
}
