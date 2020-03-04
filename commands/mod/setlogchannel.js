exports.help = {
  name: "setlogchannel",
  description: "Задать канал для Логирования",
	aliases: ['slc', 'setlc'],
  usage: [{type: 'channel', opt: 0}],
	dm: 1,
  tier: -3,
  cooldown: 5,
	hide: 1
};

exports.run = (client, msg) => {
	client.userLib.db.update(`guilds`, {guildId: msg.guild.id, logchannel: msg.mentions.channels.first().id}, () => {
		let embed = new client.userLib.discord.MessageEmbed()
			.setColor(client.userLib.colors.suc)
			.setTitle('Лог канал')
			.setDescription(`Лог канал теперь ${msg.mentions.channels.first()}`)
			.setTimestamp();
		msg.channel.send(embed);
	})
}; 