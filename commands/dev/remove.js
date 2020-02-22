exports.help = {
	name: "remove",
	description: "Выгнать бота с сервера",
	aliases: [],
	usage: [{type: 'text', opt: 0, name: 'id'}],
	dm: 1,
	tier: 1,
	cooldown: 0
};

exports.run = (client, msg, args) => {
	let guild = client.guilds.get(args[0]);
	try {
		guild.leave();
		msg.channel.send('OK!');
	} catch {msg.channel.send('Ошибка!');}
};