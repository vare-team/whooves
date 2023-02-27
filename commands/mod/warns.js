exports.help = {
	name: 'warns',
	description: 'Количество предупреждений',
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
	const user = interaction.options.getUser('пользователь') || interaction.user;

	let warns = await client.userLib.db
		.promise()
		.query('SELECT * FROM warns WHERE userId = ? AND guildId = ?', [user.id, interaction.guildId]);
	warns = warns[0];

	const embed = new client.userLib.discord.MessageEmbed()
		.setColor(client.userLib.colors.inf)
		.setAuthor(`${user.username}#${user.discriminator}`, user.displayAvatarURL())
		.setTitle('Предупреждения')
		.setTimestamp();

	let descGenerator = `Количество предупреждений: **${warns.length}**\n\n`;
	for (const warn of warns)
		descGenerator += `(ID: **${warn.warnId}**); <@!${warn.who}>: ${warn.reason ?? 'Не указана'}\n`;
	embed.setDescription(descGenerator);

	interaction.reply({ embeds: [embed], ephemeral: true });
};
