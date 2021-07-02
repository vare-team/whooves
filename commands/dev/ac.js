exports.help = {
	name: 'ac',
	description: 'Загрузка команды',
	aliases: [],
	usage: [
		{ type: 'text', opt: 0, name: 'название модуля' },
		{ type: 'text', opt: 0, name: 'название команды' },
	],
	dm: 1,
	tier: 1,
	cooldown: 0,
};

const { readdirSync, lstatSync } = require('fs');

exports.run = (client, msg, args) => {
	if (
		readdirSync('./commands/')
			.filter(dir => lstatSync(`./commands/${dir}`).isDirectory())
			.indexOf(args[0]) == -1
	) {
		client.userLib.retError(msg, 'Такого модуля не существует!');
		return;
	}

	const props = require(`../${args[0]}/${args[1]}`);
	if (!props.help.hide) {
		props.help.module = args[0];
		client.commands.set(args[1], props);
	}

	const notifyEmbed = new client.userLib.discord.MessageEmbed()
		.setDescription(`Команда ${args[1]} загружена.`)
		.setColor(client.userLib.colors.suc);

	msg.channel.send(notifyEmbed);
};
