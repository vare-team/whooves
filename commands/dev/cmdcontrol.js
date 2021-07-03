exports.help = {
	name: 'cmdcontrol',
	description: 'Перезагрузка команды',
	aliases: ['cmdc'],
	usage: [
		{ type: 'text', opt: 0, name: 'название команды' },
		{ type: 'text', opt: 0, name: 'параметр' },
		{ type: 'text', opt: 0, name: 'значение' },
	],
	dm: 1,
	tier: 2,
	cooldown: 0,
};

exports.run = (client, msg, args) => {
	const cmd =
		client.commands.get(args[0].toLowerCase()) ||
		client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(args[0].toLowerCase()));

	if (!cmd) return client.userLib.retError(msg, 'Команды не существует!');

	if (args[1] === 'tier') return client.userLib.retError(msg, 'Изменение прав команды запрещено!');

	const command = require(`../${cmd.help.module}/${cmd.help.name}.js`);
	command.help.module = cmd.help.module;

	if (typeof client.userLib.helpExample[args[1]] === 'number') args[2] = Number(args[2]);
	command.help[args[1]] = args[2];

	const notifyEmbed = new client.userLib.discord.MessageEmbed()
		.setDescription(`Команда ${cmd.help.name} обновлена.`)
		.setColor(client.userLib.colors.suc);

	msg.channel.send(notifyEmbed);
};
