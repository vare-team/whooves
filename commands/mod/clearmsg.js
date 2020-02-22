exports.help = {
  name: "clearmsg",
  description: "Очистить сообщения",
	aliases: ['cm', 'c', 'cl'],
  usage: [{type: 'text', opt: 0, name: 'кол-во'}],
	dm: 0,
	tier: -1,
  cooldown: 5
};

exports.run = async (client, msg, args) => {
	if (isNaN(+args[0])) {
		client.userLib.retError(msg, 'Аргумент должен быть числом.');
		return;
	}

	let dmsg = await msg.channel.bulkDelete(+args[0] > 100 ? 100 : +args[0], true);

	let embed = new client.userLib.discord.RichEmbed()
		.setColor(client.userLib.colors.suc)
		.setTitle('Удаление сообщений')
		.setDescription(`Сообщения были удалены (**${dmsg.size}**)!`)
		.setTimestamp();

	msg.channel.send(embed).then(msgs => msgs.delete(10000));
};