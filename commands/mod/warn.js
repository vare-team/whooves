exports.help = {
  name: "warn",
  description: "Выдать предупреждение участнику",
	aliases: ['w'],
  usage: "[@кто] [за что]",
	dm: 1,
  args: 1,
	tier: -1,
  cooldown: 5
};

exports.run = async (client, msg, args) => {
	if (!msg.mentions.users.first()) {
		client.userLib.retError(msg.channel, msg.author);
		return;
	}

	if (msg.mentions.members.first().id == msg.author.id) {
		client.userLib.retError(msg.channel, msg.author);
		return;
	}

	client.userLib.db.insert('warns', {
		userId: msg.mentions.users.first().id,
		guildId: msg.guild.id,
		who: msg.author.id,
		reason: args.slice(1).join(' ')
	}, () => {});

	// let warns = await client.userLib.promise(client.userLib.db, client.userLib.db.count, 'warns', {userId: msg.mentions.users.first().id, guildId: msg.guild.id});
	// console.log(warns);
	// warns = warns.res;

	let embed = new client.userLib.discord.RichEmbed()
		.setColor(client.userLib.colors.war)
		.setTitle(`${msg.mentions.users.first().tag} выдано предупреждение!`)
		// .setDescription(`Теперь у **** **${warns}** предупреждений.`)
		.setTimestamp()
		.setFooter(msg.author.tag, msg.author.avatarURL);

	msg.channel.send(embed);
};