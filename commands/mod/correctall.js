import { MessageEmbed } from 'discord.js';
import colors from '../../models/colors.js';
import { getClearNickname, isNicknameClear } from '../../utils/modules/nickname.js';
import { emoji } from '../../utils/modules/respondMessages.js';

export const help = {
	name: 'correctall',
	description: 'Исправляет все никнеймы участников на сервере.',
	extraPermissions: ['MANAGE_NICKNAMES'],
};

export const command = {
	name: help.name,
	description: help.description,
};

export async function run(interaction) {
	await interaction.deferReply();

	await interaction.guild.members.fetch({ force: true });

	let counter = 0;

	const embed = new MessageEmbed().setColor(colors.success).setDescription('');

	for (const member of interaction.guild.members.cache) {
		const name = member[1].displayName;

		if (member[1].manageable && !isNicknameClear(name) && counter < 25) {
			const correctName = getClearNickname(name);
			await member[1].edit({ nick: correctName });

			if (embed.description.length + name.length + correctName.length + 28 < 2000)
				embed.setDescription(
					`${embed.description}\`\`${counter + 1})\`\` ${name}#${
						member[1].user.discriminator
					} \`\`=>\`\` ${correctName}\n`
				);
			else break;

			counter++;
		}
	}

	if (counter) {
		embed
			.setTitle(`${emoji.ready} Отредактировано: ${counter}/${interaction.guild.memberCount}`)
			.setDescription(embed.description);
	} else {
		embed.setTitle(`${emoji.ready} Изменений нет!`).setDescription('');
	}

	await interaction.editReply({ embeds: [embed] });
}

export default {
	help,
	command,
	run,
};
