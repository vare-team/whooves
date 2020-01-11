exports.help = {
	name: "rc",
	description: "Перезагрузка команды",
	aliases: [],
	usage: "[название команды]",
	dm: 1,
	tier: 1,
	cooldown: 0
};

exports.run = (client, msg, args) => {
	const cmd = client.commands.get(args[0].toLowerCase()) || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(args[0].toLowerCase()));

	if (!cmd) {
		client.userLib.retError(msg.channel, msg.author, 'Команды не существует!');
		return;
	}

	delete require.cache[require.resolve(`../${cmd.help.module}/${cmd.help.name}.js`)];
	client.commands.delete(cmd.help.name);

	const command = require(`../${cmd.help.module}/${cmd.help.name}.js`);
	command.help.module = cmd.help.module;
	client.commands.set(cmd.help.name, command);

	const notifyEmbed = new client.userLib.discord.RichEmbed()
		.setDescription(`Команда ${cmd.help.name} обновлена.`)
		.setColor(client.userLib.colors.suc);

	msg.channel.send(notifyEmbed);
};