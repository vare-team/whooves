exports.help = {
    name: "clearmsg",
    description: "Очистить сообщения",
    usage: "clearmsg [кол-во]",
    flag: 2,
    cooldown: 500
};

exports.run = (client, msg, args, Discord) => {
	var embed = new Discord.RichEmbed();

	let amount = args[0];
	if (!amount) { embed.setColor(client.userLib.config.colors.err).setTitle('Ошибка!').setDescription("Вы не указали кол-во сообщений!"); return msg.channel.send(embed); }
	if (amount > 100) { embed.setColor(client.userLib.config.colors.err).setTitle('Ошибка!').setDescription("Вы не можете удалить более 100 сообщений!"); return msg.channel.send(embed); }

	client.userLib.db.queryValue('SELECT logchannel FROM guilds WHERE id = ?', [msg.guild.id], (err, logchannel) => {
		msg.channel.bulkDelete(amount, true).then(dmsg => {
			embed
				.setColor(client.config.colors.suc)
				.setTitle('Удаление сообщений')
				.setDescription(`Сообщения были удалены (**${dmsg.size}**)!`)
				.setTimestamp();
			msg.channel.send(embed).then(delmsg => { delmsg.delete(5000); });
	
			if (logchannel == '0') return;
			embed
				.setColor(client.config.colors.inf)
				.setTitle(`Массовое удаление сообщений`)
				.setDescription(`Было удалено **${dmsg.size}** сообщений в канале <#${msg.channel.id}>`)
				.setAuthor(msg.author.tag, msg.author.displayAvatarURL)
				.setTimestamp();

    		let sendlogchannel = client.channels.get(logchannel);
    		if (!sendlogchannel) return client.userLib.db.upsert(`guilds`, {id: msg.guild.id, logchannel: 0}, (err) => { if(err) throw err; });
    		sendlogchannel.send(embed);
		});
	});
};