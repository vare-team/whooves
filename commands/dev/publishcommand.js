import { MessageEmbed } from 'discord.js';

export const APILinks = {
	devGuild: 'https://discord.com/api/v9/applications/662302431282987009/guilds/581070953703014401/commands',
	release: `https://discord.com/api/v9/applications/${discordClient.user.id}/commands/`,
}

export const help = {
	name: 'publishcommand',
	description: 'Опубликовать команду',
}

export const command = {
	name: help.name,
	description: help.description,
	options: [
		{
			name: 'команда',
			description: 'название команды',
			type: 3,
			required: true,
			autocomplete: true,
		},
	],
}

export async function run(interaction) {

	const embed = new MessageEmbed().setTimestamp()

	client.userLib.request.post( //TODO: Axios
		APILinks.devGuild,
		{
			headers: { Authorization: 'Bot ' + discordClient.token },
			json: client.commands.get(interaction.options.getString('команда')).command,
		},
		function (error, response, body) {
			embed.addField('Body', '```json\n' + JSON.stringify(body, null, ' ') + '```')
			embed.addField('Error', '```json\n' + JSON.stringify(error, null, ' ') + '```')
			interaction.reply({ embeds: [embed], ephemeral: true })
		}
	)
}

export async function autocomplete(interaction) {
	const commands = client.commands //TODO: Commands
	const respond = []

	for (let element of commands) {
		if (element[0].startsWith(interaction.options.getString('команда')) && respond.length < 25)
		respond.push({
			name: element[0],
			value: element[0]
		})
	}

	interaction.respond(respond)
}

export default {
	help,
	command,
	run,
	autocomplete
}
