exports.help = {
  name: "dellogchannel",
  description: "Отключить Лог-канал",
	aliases: ['dlc', 'dellc'],
  usage: [],
	dm: 0,
  tier: -3,
  cooldown: 10,
	hide: 1
};

exports.run = (client, msg) => {
	client.userLib.db.upsert(`guilds`, {guildId: msg.guild.id, logchannel: null}, () => {
		let embed = new client.userLib.discord.RichEmbed()
			.setColor(client.userLib.colors.suc)
			.setTitle('Лог канал')
			.setDescription(`Лог канал отключён.`)
			.setTimestamp();
		msg.channel.send(embed);
		client.userLib.sendLogChannel("commandUse", msg.guild, { user: { tag: msg.author.tag, id: msg.author.id, avatar: msg.author.displayAvatarURL }, channel: { id: msg.channel.id }, content: 'отключение лог канала'});
	})
};