const rand = require('random');

exports.help = {
    name: "minesweeper",
    description: "Генерирует поле игры \"Сапёр\"",
    usage: "minesweeper [5 - 10]",
    flag: 3,
    cooldown: 1000
};

exports.run = (client, msg, args, Discord) => {
	let embed = new Discord.RichEmbed(), pole = 0, terr = '', trans = 0, bombs = 0, arg = parseInt(args[0]);
	if (!arg || arg < 4 || arg > 11) { embed.setColor(client.userLib.config.colors.err).setTitle('Ошибка!').setDescription(`Ваше число вышло из допустимого диапозона!`); return msg.channel.send(embed); }
	pole = arg;
	let calculated = pole * pole;
	trans = pole;

	for (var i = 1; i <= calculated; i++) {
		switch (rand.int(0, 10)) {
			case 10 :
				terr += '||💣||';
				bombs++;
				break;

			default :
				terr += '||#⃣||';
				break;
		}
		if (trans == i) {
			trans += pole;
			terr += '\n';
		}
	}

	embed
		.setColor(client.userLib.config.colors.inf)
		.setTitle(`Сапёр ${pole}x${pole}\nБомб на уровне: ${bombs}`)
		.setDescription(terr);
	
	return msg.channel.send(embed);
};