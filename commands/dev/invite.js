exports.help = {
	name: "invite",
	description: "Генерация инвайта на сервер",
	aliases: [],
	usage: [{type: 'text', opt: 0, name: 'id'}],
	dm: 1,
	tier: 1,
	cooldown: 0
};

exports.run = (client, msg, args) => {
		let guild = client.guilds.get(args[0]);
		try {
			guild.channels.filter(chan => chan.type == 'text').first().createInvite()
				.then((invite) => msg.channel.send(guild.name + ' = ' + invite.url));
		} catch {msg.channel.send('Ошибка!');}
};