exports.help = {
  name: "warns",
  description: "Количество ваших предупреждений",
	aliases: [],
  usage: "(@кто)",
	dm: 0,
	tier: 0,
  cooldown: 15
};

exports.run = async (client, msg) => {
	let user = msg.mentions.users.first() || msg.author;
	let warns = await client.userLib.promise(client.userLib.db, client.userLib.db.query, 'SELECT * FROM warns WHERE userId = ? AND guildId = ?', [user.id, msg.guild.id]);
	warns = warns.res;

	let embed = new client.userLib.discord.RichEmbed()
		.setColor(client.userLib.colors.inf)
		.setTitle('Предупреждения ' + user.username)
		.setTimestamp()
		.setFooter(msg.author.tag, msg.author.avatarURL);

	let descGenerator = 'Количество предупреждений: **' + warns.length + '**\n\n';
	for (let warn of warns) descGenerator += `(ID: **${warn.warnId}**); <@!${warn.who}>: ${warn.reason}\n`;
	embed.setDescription(descGenerator);

	msg.channel.send(embed);
};