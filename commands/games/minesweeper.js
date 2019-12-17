exports.help = {
  name: "minesweeper",
  description: "Генерирует поле игры \"Сапёр\"",
	aliases: [],
  usage: "[5 - 10]",
	dm: 1,
	args: 1,
  tier: 0,
  cooldown: 1
};

//TODO сделать нормальную генерацию

exports.run = (client, msg, args) => {

	let pole = +args[0];
	if (isNaN(pole) || pole < 4 || pole > 11) {
		let embed = new client.userLib.discord.RichEmbed().setColor(client.userLib.colors.err).setTitle('Ошибка!').setDescription(`Ваше число вышло из допустимого диапозона!`);
		msg.channel.send(embed);
		return;
	}

	let terr = '', bombs = 0;

	for (var i = 1, calc = pole * pole; i <= calc; i++) {
		if (client.userLib.randomIntInc(0, 10) == 10) {
			terr += '||💣||';
			bombs++;
		} else {terr += '||#⃣||';}
		if (i % pole == 0) {
			terr += '\n';
		}
	}

	let	embed = new client.userLib.discord.RichEmbed()
		.setColor(client.userLib.colors.inf)
		.setTitle(`Сапёр ${pole}x${pole}\nБомб на уровне: ${bombs}`)
		.setDescription(terr);
	
	msg.channel.send(embed);
};