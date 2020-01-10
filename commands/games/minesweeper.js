exports.help = {
  name: "minesweeper",
  description: "Генерирует поле игры \"Сапёр\"",
	aliases: ['ms'],
	usage: '(кол-во строк) (кол-во столбцов) (кол-во мин)',
	dm: 1,
  tier: 0,
  cooldown: 1
};

const Minesweeper = require('discord.js-minesweeper');

exports.run = (client, msg, args) => {

	if (args[0] && isNaN(+args[0]) || args[1] && isNaN(+args[1]) || args[2] && isNaN(+args[2])) {
		client.userLib.retError(msg.channel, msg.author, 'Всё должно быть числами.');
		return;
	}

	const minesweeper = new Minesweeper({
		rows: args[0],
		columns: args[1],
		mines: args[2],
		returnType: 'emoji',
	});

	let pole = minesweeper.start();

	if (!pole) {
		client.userLib.retError(msg.channel, msg.author, 'Ошибка генерации. Не правильные параметры.');
		return;
	}

	let	embed = new client.userLib.discord.RichEmbed()
		.setColor(client.userLib.colors.inf)
		.setTitle(`Сапёр ${minesweeper.rows}x${minesweeper.columns}\nБомб на уровне: ${minesweeper.mines}`)
		.setDescription(pole);
	
	msg.channel.send(embed);
};