exports.help = {
  name: "clearmsg",
  description: "Очистить сообщения",
	aliases: ['cm', 'c', 'cl'],
  usage: "[кол-во]",
	dm: 0,
	args: 1,
	tier: -1,
  cooldown: 5
};

//TODO модификация под больше 100 сообщений

exports.run = (client, msg, args) => {
	if (isNaN(+args[0])) {client.userLib.retError(msg.channel, msg.author, 'Аргумент должен быть числом.'); return;}
	msg.channel.bulkDelete(+args[0] > 100 ? 100 : +args[0], true).then(dmsg => {
		let embed = new client.userLib.discord.RichEmbed()
			.setColor(client.userLib.colors.suc)
			.setTitle('Удаление сообщений')
			.setDescription(`Сообщения были удалены (**${dmsg.size}**)!`)
			.setTimestamp();
		msg.channel.send(embed).then(msg => msg.delete(10000));
	});
};