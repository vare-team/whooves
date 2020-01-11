exports.help = {
  name: "dellogchannel",
  description: "Отключить Лог-канал",
	aliases: ['dlc', 'dellc'],
  usage: "",
	dm: 0,
  tier: -3,
  cooldown: 10
};

exports.run = (client, msg) => {
	client.userLib.db.upsert(`guilds`, {guildId: msg.guild.id, logchannel: null}, () => {
		let embed = new client.userLib.discord.RichEmbed()
			.setColor(client.userLib.colors.suc)
			.setTitle('Лог канал')
			.setDescription(`Лог канал отключён.`)
			.setTimestamp();
		msg.channel.send(embed);
	})
};