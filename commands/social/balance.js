exports.help = {
  name: "balance",
  description: "Показать баланс",
	aliases: ['bal'],
  usage: "(@кто)",
	dm: 0,
  tier: 0,
  cooldown: 5
};

exports.run = async (client, msg) => {
	let user = msg.mentions.users.first() || msg.author;

	if (user.bot) {
		client.userLib.retError(msg.channel, msg.author, 'У машин не может быть монет. Машины должны только подчиняться.');
		return;
	}

	let coins = await client.userLib.promise(client.userLib.db, client.userLib.db.queryValue,'SELECT money FROM users WHERE userId = ?', [user.id]);
	coins = coins.res;

	if (!coins) {
		client.userLib.retError(msg.channel, msg.author, 'Ваш баланс пуст, так как у вас даже ещё кошелька нет!\nПопробуй написать что-нибудь в чат для начала.');
		return;
	}

	let embed = new client.userLib.discord.RichEmbed().setColor(client.userLib.colors.inf).setTitle('Баланс: ' + coins).setFooter(user.tag, user.displayAvatarURL);
	msg.channel.send(embed);
};