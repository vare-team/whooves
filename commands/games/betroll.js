exports.help = {
  name: "betroll",
  description: "Делает ставку на определенное количество валюты. Генерируется число от 0 до 100. 66 дает X2 вашей валюты, более 90-X4 и 100 X10.",
	aliases: ['bet', 'b'],
  usage: "[кол-во]",
	dm: 0,
	args: 1,
  tier: 0,
  cooldown: 1
};

exports.run = async (client, msg, args) => {
	if (isNaN(+args[0])) {
		client.userLib.retError(msg.channel, msg.author, 'Ставка должны быть числом. Я принимаю только межгалактические монеты.');
		return;
	}

	let bet = Math.round(+args[0]);

	if (bet < 0) {
		client.userLib.retError(msg.channel, msg.author, 'Играть на мои деньги? Умно, но не достаточно.');
		return;
	}

	if (bet == 0) {
		client.userLib.retError(msg.channel, msg.author, 'Хлопок одним копытом лучше будет.');
		return;
	}

	let uscoins = await client.userLib.promise(client.userLib.db, client.userLib.db.queryValue,'SELECT money FROM users WHERE userId = ?', [msg.author.id]);

	if (uscoins < bet) {
		client.userLib.retError(msg.channel, msg.author, 'Мечтать хорошо, не спорю, но у тебя нет такого количества денег.');
		return;
	}

	let embed = new client.userLib.discord.RichEmbed()
		.setAuthor(msg.author.tag, msg.author.avatarURL)
		.setColor(client.userLib.colors.inf);

	let random = client.userLib.randomIntInc(0, 100);

	if (random >= 66 && random < 90) bet = bet*2;
	else if (random >= 90 && random != 100) bet = bet*4;
	else if (random == 100) bet = bet*10;

	client.userLib.db.query(`UPDATE users SET money = money + ? WHERE userId = ?`, [random < 66 ? -bet : bet, msg.author.id]);

	embed
		.setTitle(random < 66 ? 'В следующий раз повезёт!' : 'Победа!')
		.setDescription(`Вам выпало число **${random}**\nВы ${random < 66 ? 'проиграли' : 'выйграли'} **${bet}**`);

	msg.channel.send(embed);
};