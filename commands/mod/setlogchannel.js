exports.help = {
  name: "setlogchannel",
  description: "Задать канал для Логирования",
	aliases: ['slc', 'setlc'],
  usage: "[#текстовый канал]",
	dm: 1,
	args: 1,
  tier: -3,
  cooldown: 5
};

exports.run = (client, msg, args) => {
	
	if (!msg.mentions.channels.first()) {
		client.userLib.retError(msg.channel, msg.author, 'Нужно указать канал.');
		return;
	}

	client.userLib.db.update(`guilds`, {guildId: msg.guild.id, logchannel: msg.mentions.channels.first().id}, () => {
		let embed = new client.userLib.discord.RichEmbed()
			.setColor(client.userLib.colors.suc)
			.setTitle('Лог канал')
			.setDescription(`Лог канал теперь ${msg.mentions.channels.first()}`)
			.setTimestamp();
		msg.channel.send(embed);
	})
}; 