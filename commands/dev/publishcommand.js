exports.help = {
	name: 'publishcommand',
	description: 'Опубликовать команду.',
	dm: 1,
	tier: 0,
	cooldown: 5,
};

exports.command = {
	name: exports.help.name,
	description: exports.help.description,
	options: [
		{
			name: 'команда',
			description: 'название команды',
			type: 3,
			required: true
		},
	],
};

exports.run = async (client, interaction) => {
	const APILinks = {
		devGuild: 'https://discord.com/api/v9/applications/662302431282987009/guilds/581070953703014401/commands',
		release: `https://discord.com/api/v9/applications/${client.user.id}/commands/`,
	};

	let embed = new client.userLib.discord.MessageEmbed().setTimestamp();

	client.userLib.request.post(
		APILinks.devGuild,
		{
			headers: { Authorization: 'Bot ' + client.token },
			json: client.commands.get(interaction.options.getString('команда')).command,
		},
		function (error, response, body) {
			embed.addField('Body', '```json\n' + JSON.stringify(body, null, ' ') + '```');
			embed.addField('Error', '```json\n' + JSON.stringify(error, null, ' ') + '```');
			interaction.reply({ embeds: [embed], ephemeral: true });
		}
	);
};
