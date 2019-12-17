exports.help = {
  name: "dellogchannel",
  description: "Отключить Лог-канал",
	aliases: ['dlc', 'dellc'],
  usage: "",
	dm: 0,
	args: 1,
  tier: -3,
  cooldown: 10
};

let embed;

exports.run = (client, msg, args, Discord) => {
	
	client.db.upsert(`servers`, {id: msg.guild.id, logchannel: 0}, (err) => {
		embed = new Discord.RichEmbed()
		.setColor(client.config.colors.suc)
		.setTitle('Лог канал')
		.setDescription(`Лог канал отключён.`)
		.setTimestamp();
		return msg.channel.send({embed});
	})
}; 