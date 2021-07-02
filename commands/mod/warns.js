exports.help = {
	name: 'warns',
	description: 'Количество ваших предупреждений',
	aliases: [],
	usage: [{ type: 'user', opt: 1 }],
	dm: 0,
	tier: 0,
	cooldown: 15,
};

exports.run = async (client, msg) => {
	let user = msg.magicMention.user || msg.author;
	let warns = await client.userLib.db
		.promise()
		.query('SELECT * FROM warns WHERE userId = ? AND guildId = ?', [user.id, msg.guild.id]);
	warns = warns[0];

	let embed = new client.userLib.discord.MessageEmbed()
		.setColor(client.userLib.colors.inf)
		.setTitle('Предупреждения ' + user.username)
		.setTimestamp()
		.setFooter(msg.author.tag, msg.author.displayAvatarURL());

	let descGenerator = 'Количество предупреждений: **' + warns.length + '**\n\n';
	for (let warn of warns) descGenerator += `(ID: **${warn.warnId}**); <@!${warn.who}>: ${warn.reason}\n`;
	embed.setDescription(descGenerator);

	msg.channel.send(embed);
};
