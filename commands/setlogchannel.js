exports.help = {
    name: "setlogchannel",
    description: "Задать канал для Логирования",
    usage: "setlogchannel [#текстовый канал]",
    flag: 1,
    cooldown: 500
};

exports.run = (client, msg, args, Discord) => {
	var embed = new Discord.RichEmbed()

	let channel = msg.guild.channel(msg.mentions.channels.first() || msg.guild.channels.get(args[0]));
	if (!channel) {embed.setColor(client.userLib.config.colors.err).setTitle('Ошибка!').setDescription(`Вы не указали канал!`);return msg.channel.send(embed);}

	client.userLib.db.upsert(`guilds`, {id: msg.guild.id, logchannel: channel.id}, (err) => {
		embed
			.setColor(client.userLib.config.colors.suc)
			.setTitle('Лог-канал')
			.setDescription(`Лог-канал теперь ${channel}`)
			.setTimestamp();

		return msg.channel.send(embed);
	});
}; 