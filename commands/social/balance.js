let embed, user;

exports.help = {
    name: "balance",
    description: "Показать баланс",
    usage: "balance (@кто)",
    flag: 3,
    cooldown: 1000
}

exports.run = (client, msg, args, Discord) => {

	function stablem(money, ico) {
		money = money.toString().replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1.')+' '+ico;
		return money;
	};


	client.db.queryValue('SELECT moneyico FROM servers WHERE id = ?', [msg.guild.id], (err, ico) => {
			if (!msg.mentions.users.first()) {
				user = msg.author;
			} else if (msg.mentions.users.first().bot) {
				embed = new Discord.RichEmbed().setColor(client.config.colors.err).setTitle('Ошибка!').setDescription('У бота не может быть монет!');
				return msg.channel.send({embed});
			} else if (msg.mentions.users.first()) {
				user = msg.mentions.users.first();
			}
		client.db.queryValue('SELECT coins FROM users WHERE id = ? AND serid = ?', [user.id, msg.guild.id], (err, coins) => {
			embed = new Discord.RichEmbed().setColor(client.config.colors.inf).setTitle('Баланс').setDescription(`${stablem(coins, ico)}`).setFooter(user.tag);
			msg.channel.send({embed});
		});
	});

};