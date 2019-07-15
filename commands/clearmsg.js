let embed;

exports.help = {
    name: "clearmsg",
    description: "Очистить сообщения",
    usage: "clearmsg [кол-во]",
    flag: 2,
    cooldown: 500
}

exports.run = (client, msg, args, Discord) => {
	
	if (!parseInt(args[1])) return;

	let amount = parseInt(args[1]);

	if (amount > 100) amount = 100;

	client.db.queryValue('SELECT logchannel FROM servers WHERE id = ?', [msg.guild.id], (err, logchannel) => {

		msg.channel.bulkDelete(amount, true).then(dmsg => {
			embed = new Discord.RichEmbed()
			.setColor(client.config.colors.suc)
			.setTitle('Удаление сообщений')
			.setDescription(`Сообщения были удалены (**${dmsg.size}**)!`)
			.setTimestamp();
			msg.channel.send({embed}).then(msg => {msg.delete(10000);});
	
			if (logchannel == '0') return;
		
			embed = new Discord.RichEmbed()
			.setColor(client.config.colors.inf)
			.setTitle(`Массовое удаление сообщений`)
			.setDescription(`Было удалено **${dmsg.size}** сообщений в канале <#${msg.channel.id}>`)
			.setAuthor(msg.author.tag, msg.author.avatarURL)
			.setTimestamp();
    		let sendlogchannel = client.channels.get(logchannel);
    		if (!sendlogchannel) return client.db.upsert(`servers`, {id: msg.guild.id, logchannel: 0}, (err) => {});
    		sendlogchannel.send({embed});
		});
	});

}