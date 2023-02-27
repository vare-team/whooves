import { MessageEmbed } from 'discord.js';
import axios from 'axios';
import { commands } from '../index.js';
import colors from '../../models/colors.js';

export const APILinks = {
	devGuild: 'https://discord.com/api/v9/applications/662302431282987009/guilds/581070953703014401/commands',
	release() {
		return `https://discord.com/api/v9/applications/${discordClient.user.id}/commands/`;
	},
};

export const help = {
	name: 'publishcommand',
	description: 'Publish command to Discord',
};

export const command = {
	name: help.name,
	// name_localizations: {
	// 	'ru': 'опубликоватькоманду'
	// },
	description: help.description,
	description_localizations: {
		ru: 'Опубликовать команду в Discord',
	},
	options: [
		{
			name: 'command',
			name_localizations: {
				ru: 'команда',
			},
			description: 'Command name',
			description_localizations: {
				ru: 'Название команды',
			},
			type: 3,
			required: true,
			autocomplete: true,
		},
	],
};

export async function run(interaction) {
	const embed = new MessageEmbed().setTimestamp().setColor(colors.success);

	const response = await axios
		.post(APILinks.devGuild, commands[interaction.options.getString('команда')].command, {
			headers: { Authorization: `Bot ${discordClient.token}` },
		})
		.catch(e => e);

	if (!response.response)
		embed.addField(
			`Body (Status: ${response.status})`,
			`\`\`\`json\n${JSON.stringify(response.data, null, ' ')}\`\`\``
		);
	else
		embed
			.addField(
				`${response.response.status}: ${response.response.statusText}`,
				`\`\`\`json\n${JSON.stringify(response.response.data, null, ' ')}\`\`\``
			)
			.setColor(colors.error);

	interaction.reply({ embeds: [embed], ephemeral: true });
}

export async function autocomplete(interaction) {
	const respond = [];
	console.log(interaction);

	for (const element of Object.keys(commands).filter(el => !el.startsWith('__'))) {
		if (element.startsWith(interaction.options.getString('command')) && respond.length < 25)
			respond.push({
				name: element,
				value: element,
			});
	}

	interaction.respond(respond);
}

export default {
	help,
	command,
	run,
	autocomplete,
};
