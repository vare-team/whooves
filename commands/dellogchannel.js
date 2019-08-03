exports.help = {
    name: "dellogchannel",
    description: "Отключить лог-канал",
    usage: "dellogchannel",
    flag: 1,
    cooldown: 30000
};

exports.run = (client, msg, args, Discord) => {
	client.userLib.db.upsert(`guilds`, {id: msg.guild.id, logchannel: 0}, (err) => {
		var embed = new Discord.RichEmbed()
			.setColor(client.userLib.config.colors.suc)
			.setTitle('Лог-канал')
			.setDescription(`Лог-канал отключён.`)
			.setTimestamp();
		return msg.channel.send(embed);
	});
}; 