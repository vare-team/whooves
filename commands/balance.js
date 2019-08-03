exports.help = {
    name: "balance",
    description: "Показать баланс",
    usage: "balance (@кто)",
    flag: 3,
    cooldown: 1000
};

exports.run = (client, msg, args, Discord) => {
	function stablem(money, ico) {
		return money.toString().replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1.')+' '+ico;
	}

	client.userLib.db.queryValue('SELECT moneyico FROM guilds WHERE id = ?', [msg.guild.id], (err, returnico) => {
		var embed = new Discord.RichEmbed();
		var user = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[0]));
		if (user && user.user.bot) {
			embed.setColor(client.userLib.config.colors.err).setTitle('Ошибка!').setDescription('У бота не может быть монет!');
			return msg.channel.send(embed);
		}
		var userid = (user) ? user.id : msg.author.id;
		var usernick = (user) ? user.user.username : msg.author.username;
		var usertag = (user) ? user.user.tag : msg.author.tag;
		client.userLib.db.queryValue('SELECT money FROM account WHERE id = ?', [userid], (err, returncoins) => {
			// if(!returncoins) { embed.setColor(client.userLib.config.colors.err).setTitle('Ошибка!').setDescription(`Указанный пользователь не имеет своего профиля!`); return msg.channel.send(embed); }
			embed.setColor(client.userLib.config.colors.inf).setTitle('Баланс ' + usernick).setDescription(`${stablem(returncoins || "0", returnico)}`).setFooter(usertag);
			msg.channel.send(embed);
		});
	});
};