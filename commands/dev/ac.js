exports.help = {
	name: "ac",
	description: "Загрузка команды",
	aliases: [],
	usage: "[название модуля] [название команды]",
	dm: 1,
	tier: 1,
	cooldown: 0
};

const { readdirSync, lstatSync } = require("fs");

exports.run = (client, msg, args) => {
	if (readdirSync('./commands/').filter(dir => lstatSync(`./commands/${dir}`).isDirectory()).indexOf(args[0]) == -1) {
		client.userLib.retError(msg.channel, msg.author, 'Такого модуля не существует!');
		return;
	}

	const props = require(`../${args[0]}/${args[1]}`);
	if (!props.help.hide) {
		props.help.module = args[0];
		client.commands.set(args[1], props);
	}

	const notifyEmbed = new client.userLib.discord.RichEmbed()
		.setDescription(`Команда ${args[1]} загружена.`)
		.setColor(client.userLib.colors.suc);

	msg.channel.send(notifyEmbed);
};