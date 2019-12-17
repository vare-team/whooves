exports.help = {
	name: "rc",
	description: "",
	usage: "",
	flag: 0,
	cooldown: 0
};

//TODO сделать перезагрузку категорией и подгрузка команд без перезагрузки бота

exports.run = (client, msg, args) => {

	const commandName = args[0].toLowerCase();

	if (!client.commands.has(commandName)) {
		client.userLib.retError(msg.channel, msg.author, 'Команды не существует!');
		return;
	}

	const commandModule = client.commands.get(commandName).help.module;

	delete require.cache[require.resolve(`../${commandModule}/${commandName}.js`)];
	client.commands.delete(commandName);

	const command = require(`../${commandModule}/${commandName}.js`);
	command.help.module = commandModule;
	client.commands.set(commandName, command);

	const notifyEmbed = new client.userLib.discord.RichEmbed()
		.setDescription(`Команда ${commandName} обновлена.`)
		.setColor(client.userLib.colors.suc);

	msg.channel.send(notifyEmbed);
};