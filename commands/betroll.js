const rand = require('random')

let embed;

exports.help = {
    name: "betroll",
    description: "Делает ставку на определенное количество валюты. Генерируется число от 0 до 100. 66 дает X2 вашей валюты, более 90-X4 и 100 X10.",
    usage: "betroll [кол-во]",
    flag: 3,
    cooldown: 1000
}

exports.run = (client, msg, args, Discord) => {

	function stablem(money, ico) {
		money = money.toString().replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1.')+' '+ico;
		return money;
	};

	if (!parseInt(args[1])) return;

	let bet = Math.round(parseInt(args[1]));

	client.db.queryValue('SELECT coins FROM users WHERE id = ? AND serid = ?', [msg.author.id, msg.guild.id], (err, uscoins) => {
		client.db.queryValue('SELECT moneyico FROM servers WHERE id = ?', [msg.guild.id], (err, ico) => {

			if (bet < 1) {embed = new Discord.RichEmbed().setColor(client.config.colors.err).setTitle('Ошибка!').setDescription(`Ставка не может быть меньше единицы!`); return msg.channel.send({embed})};

			if (uscoins < bet) {embed = new Discord.RichEmbed().setColor(client.config.colors.err).setTitle('Ошибка!').setDescription(`Вы не можете поставить больше, чем у вас есть!\nУ вас сейчас ${stablem(uscoins, ico)}`); return msg.channel.send({embed})};

			let random = rand.int(0, 100);

			if (random < 66) {
				client.db.query(`UPDATE users SET coins = coins - ? WHERE id = ? AND serid = ?`, [bet, msg.author.id, msg.guild.id])
				embed = new Discord.RichEmbed()
				.setAuthor(msg.author.tag, msg.author.avatarURL)
				.setColor(client.config.colors.inf)
				.setTitle('В следующий раз повезёт!')
				.setDescription(`Вам выпало число **${random}**\nВы проиграли **${stablem(bet, ico)}**`); 
				return msg.channel.send({embed})
			} else if (random >= 66 && random < 90) {
				client.db.query(`UPDATE users SET coins = coins + ? WHERE id = ? AND serid = ?`, [bet*2, msg.author.id, msg.guild.id])
				embed = new Discord.RichEmbed()
				.setAuthor(msg.author.tag, msg.author.avatarURL)
				.setColor(client.config.colors.inf)
				.setTitle('Победа!')
				.setDescription(`Вам выпало число **${random}**\nВы выйграли **${stablem(bet*2, ico)}**`); 
				return msg.channel.send({embed})
			} else if (random >= 90 && random != 100) {
				client.db.query(`UPDATE users SET coins = coins + ? WHERE id = ? AND serid = ?`, [bet*4, msg.author.id, msg.guild.id])
				embed = new Discord.RichEmbed()
				.setAuthor(msg.author.tag, msg.author.avatarURL)
				.setColor(client.config.colors.inf)
				.setTitle('Победа!')
				.setDescription(`Вам выпало число **${random}**\nВы выйграли **${stablem(bet*4, ico)}**`); 
				return msg.channel.send({embed})
			} else if (random == 100) {
				client.db.query(`UPDATE users SET coins = coins + ? WHERE id = ? AND serid = ?`, [bet*10, msg.author.id, msg.guild.id])
				embed = new Discord.RichEmbed()
				.setAuthor(msg.author.tag, msg.author.avatarURL)
				.setColor(client.config.colors.inf)
				.setTitle('Победа!')
				.setDescription(`Вам выпало число **${random}**\nВы выйграли **${stablem(bet*10, ico)}**`); 
				return msg.channel.send({embed})
			}
		});
	});

};