exports.help = {
	name: "color",
	description: "Выводит эмбед с указанным цветом",
	aliases: [],
	usage: "[#HEX]",
	dm: 1,
	args: 1,
	tier: 0,
	cooldown: 1
};

exports.run = (client, msg, args) => {
	let embed = new client.userLib.discord.RichEmbed();

	if (!/(#|)[0-9A-Fa-f]{6}/g.test(args[0])) {
		client.userLib.retError(msg.channel, {id: msg.author.id, tag: msg.author.tag, displayAvatarURL: msg.author.displayAvatarURL}, 'Вы указали некорректный цвет!');
		return;
	}

	let color = parseInt(args[0].replace('#', ''), 16);
	
	if (color == 16777215) {
		client.userLib.retError(msg.channel, {id: msg.author.id, tag: msg.author.tag, displayAvatarURL: msg.author.displayAvatarURL}, 'Это белый цвет, честно. Просто Дискорд белый цвет отображает как чёрный на тёмной теме.');
		return;
	}

	if (!color || 16777215 < color || 0 > color) {
		client.userLib.retError(msg.channel, {id: msg.author.id, tag: msg.author.tag, displayAvatarURL: msg.author.displayAvatarURL}, 'Вы указали некорректный цвет!');
		return;
	}

	embed.setColor(color).setTitle("Цвет " + args[0].toUpperCase());
	msg.channel.send(embed);
};