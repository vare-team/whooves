exports.help = {
  name: "warns",
  description: "Количество ваших предупреждений",
	aliases: [],
  usage: "warns",
	dm: 0,
  args: 0,
	tier: 0,
  cooldown: 15
};

exports.run = async (client, msg, args) => {

	let user = msg.mentions.users.first() || msg.author;
	let warns = await client.userLib.promise(client.userLib.db, client.userLib.db.count, 'warns', {userId: user.id, guildId: msg.guild.id});
	warns = warns.res;

	let embed = new client.userLib.discord.RichEmbed()
		.setColor(client.userLib.colors.inf)
		.setTitle('Предупреждения')
		.setTimestamp()
		.setFooter(msg.author.tag, msg.author.avatarURL)
		.setDescription(warns ? `У тебя **${warns}** предупреждений.` : `У тебя ещё не было предупреждений`);

	msg.channel.send(embed);
};