exports.help = {
	name: 'clearmsgid',
	description: 'Очистить канал до определённого сообщения',
};

exports.run = async (client, msg, args) => {
	if (/([0-9]){18,19,20,21}/.test(args[0])) return client.userLib.retError(msg, 'ID сообщения введено не верно!');

	const currentMsg = await msg.channel.messages.fetch(args[0]).catch(() => 0);
	if (!currentMsg || currentMsg.channel.id !== msg.channel.id)
		return client.userLib.retError(msg, 'Сообщение не найдено!');

	await msg.channel.messages.fetch();

	const messages = msg.channel.messages.cache.filter(message => message.id >= currentMsg.id);

	const dmsg = await msg.channel.bulkDelete(messages, true);

	const embed = new client.userLib.discord.MessageEmbed()
		.setColor(client.userLib.colors.suc)
		.setTitle('Удаление сообщений')
		.setDescription(`Сообщения были удалены (**${dmsg.size}**)!`)
		.setTimestamp();

	msg.channel.send(embed).then(msgs => msgs.delete({ timeout: 10000 }));
};
