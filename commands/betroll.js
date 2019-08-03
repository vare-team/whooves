const rand = require('random');

exports.help = {
    name: "betroll",
    description: "Делает ставку на определенное количество валюты. Генерируется число от 0 до 100. 66 дает X2 вашей валюты, более 90-X4 и 100 X10.",
    usage: "betroll [кол-во]",
    flag: 3,
    cooldown: 1000
};

exports.run = (client, msg, args, Discord) => {
	function stablem(money, ico) {
		money = money.toString().replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1.')+' '+ico;
		return money;
	}

	var embed = new Discord.RichEmbed();
	if (!args[0]) {embed.setColor(client.userLib.config.colors.err).setTitle('Ошибка!').setDescription(`Вы не указали свою ставку!`); return msg.channel.send(embed);}
	let bet = Math.round(parseInt(args[0]));

	client.userLib.db.queryValue('SELECT money FROM account WHERE id = ?', [msg.author.id], (err, uscoins) => {
		client.userLib.db.queryValue('SELECT moneyico FROM guilds WHERE id = ?', [msg.guild.id], (err, ico) => {
			if (bet < 1) {embed.setColor(client.userLib.config.colors.err).setTitle('Ошибка!').setDescription(`Ставка не может быть меньше единицы!`); return msg.channel.send(embed); }
			if (uscoins < bet) {embed.setColor(client.userLib.config.colors.err).setTitle('Ошибка!').setDescription(`Вы не можете поставить больше, чем у вас есть!\nУ вас сейчас ${stablem(uscoins, ico)}`); return msg.channel.send(embed); }

			let random = rand.int(0, 100);
			if (random < 66) {
				client.userLib.db.query(`UPDATE account SET money = money - ? WHERE id = ?`, [bet, msg.author.id], (err) => { if(err) throw err; });
				embed
					.setAuthor(msg.author.tag, msg.author.avatarURL)
					.setColor(client.userLib.config.colors.inf)
					.setTitle('В следующий раз повезёт!')
					.setDescription(`Вам выпало число **${random}**\nВы проиграли **${stablem(bet, ico)}**`); 
				return msg.channel.send(embed);
			} else if (random >= 66 && random < 90) {
				client.userLib.db.query(`UPDATE account SET money = money + ? WHERE id = ?`, [bet*2, msg.author.id], (err) => { if(err) throw err; });
				embed
					.setAuthor(msg.author.tag, msg.author.avatarURL)
					.setColor(client.userLib.config.colors.inf)
					.setTitle('Победа!')
					.setDescription(`Вам выпало число **${random}**\nВы выиграли **${stablem(bet*2, ico)}**`); 
				return msg.channel.send(embed);
			} else if (random >= 90 && random != 100) {
				client.userLib.db.query(`UPDATE account SET money = money + ? WHERE id = ?`, [bet*4, msg.author.id], (err) => { if(err) throw err; });
				embed
					.setAuthor(msg.author.tag, msg.author.avatarURL)
					.setColor(client.userLib.config.colors.inf)
					.setTitle('Победа!')
					.setDescription(`Вам выпало число **${random}**\nВы выиграли **${stablem(bet*4, ico)}**`);
				return msg.channel.send(embed);
			} else if (random == 100) {
				client.userLib.db.query(`UPDATE account SET money = money + ? WHERE id = ?`, [bet*10, msg.author.id], (err) => { if(err) throw err; });
				embed
					.setAuthor(msg.author.tag, msg.author.avatarURL)
					.setColor(client.userLib.config.colors.inf)
					.setTitle('Победа!')
					.setDescription(`Вам выпало число **${random}**\nВы выиграли **${stablem(bet*10, ico)}**`); 
				return msg.channel.send(embed);
			}
		});
	});
};