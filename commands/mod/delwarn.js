exports.help = {
  name: "delwarn",
  description: "Снять предупреждение с учасика",
	aliases: ['delw', 'dw'],
  usage: "[@кто] [id]",
	dm: 0,
	args: 1,
  tier: -1,
  cooldown: 15
};

exports.run = (client, msg, args) => {
	if (!msg.mentions.users.first()) {
		client.userLib.retError(msg.channel, msg.author);
		return;
	}

	if (msg.mentions.members.first().id == msg.author.id) {
		client.userLib.retError(msg.channel, msg.author);
		return;
	}

	client.userLib.db.delete('warns', {warnId: args[1], userId: msg.mentions.users.first().id, guildId: msg.guild.id}, (err, affR) => {
		if (!affR) {
			client.userLib.retError(msg.channel, msg.author);
			return;
		}

		let embed = new client.userLib.discord.RichEmbed()
			.setColor(client.userLib.colors.war)
			.setTitle(`${msg.mentions.users.first().tag} снято предупреждение!`)
			// .setDescription(`Теперь у **** **${iswarns - 1}** предупреждений.`)
			.setTimestamp()
			.setFooter(msg.author.tag, msg.author.avatarURL);

		msg.channel.send(embed);
	});
};