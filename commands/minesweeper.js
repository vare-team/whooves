const rand = require('random')

exports.help = {
    name: "minesweeper",
    description: "Генерирует поле игры \"Сапёр\"",
    usage: "minesweeper [5 - 10]",
    flag: 3,
    cooldown: 1000
}

exports.run = (client, msg, args, Discord) => {

	let embed, pole = 0, terr = '', trans = 0, bombs = 0;

	args[1] = parseInt(args[1]);

	if (!args[1] || args[1] < 4 || args[1] > 11) {embed = new Discord.RichEmbed().setColor(client.config.colors.err).setTitle('Ошибка!').setDescription(`Ваше число вышло из допустимого диапозона!`); return msg.channel.send({embed})};

	pole = args[1];

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

		embed = new Discord.RichEmbed()
	.setColor(client.config.colors.inf)
	.setTitle(`Сапёр ${pole}x${pole}\nБомб на уровне: ${bombs}`)
	.setDescription(terr)
	
	msg.channel.send({embed});

};