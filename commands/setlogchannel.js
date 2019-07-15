
exports.help = {
    name: "setlogchannel",
    description: "Задать канал для Логирования",
    usage: "setlogchannel [#текстовый канал]",
    flag: 1,
    cooldown: 500
}

let embed;

exports.run = (client, msg, args, Discord) => {
	
	if (!msg.mentions.channels.first()) return msg.reply('Нужно указать канал');

	client.db.upsert(`servers`, {id: msg.guild.id, logchannel: msg.mentions.channels.first().id}, (err) => {
		embed = new Discord.RichEmbed()
		.setColor(client.config.colors.suc)
		.setTitle('Лог канал')
		.setDescription(`Лог канал теперь <#${msg.mentions.channels.first().id}>`)
		.setTimestamp();
		return msg.channel.send({embed});
	})
}; 