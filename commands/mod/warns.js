exports.help = {
	name: 'warns',
	description: 'Количество предупреждений',
	dm: 0,
	tier: 0,
	cooldown: 15,
};

exports.command = {
	name: exports.help.name,
	description: exports.help.description,
	options: [
		{
			name: 'пользователь',
			description: 'пользователь',
			type: 6,
		},
	],
};

exports.run = async (client, interaction) => {
	const user = new client.userLib.discord.User(
		client,
		interaction.data.hasOwnProperty('resolved')
			? Object.values(interaction.data.resolved.users)[0]
			: client.userLib.getUser(interaction).user
	);

	let warns = await client.userLib.db
		.promise()
		.query('SELECT * FROM warns WHERE userId = ? AND guildId = ?', [user.id, interaction.guild_id]);
	warns = warns[0];

	let embed = new client.userLib.discord.MessageEmbed()
		.setColor(client.userLib.colors.inf)
		.setAuthor(user.username + '#' + user.discriminator, user.displayAvatarURL())
		.setTitle('Предупреждения')
		.setTimestamp();

	let descGenerator = 'Количество предупреждений: **' + warns.length + '**\n\n';
	for (let warn of warns) descGenerator += `(ID: **${warn.warnId}**); <@!${warn.who}>: ${warn.reason}\n`;
	embed.setDescription(descGenerator);

	client.userLib.replyInteraction(interaction, embed);
};
