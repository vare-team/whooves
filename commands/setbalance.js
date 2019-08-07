exports.help = {
    name: "setbalance",
    description: "Установить баланс участнику",
    usage: "setbalance [@кто] [кол-во]",
    flag: 0,
    cooldown: 0
};

exports.run = (client, msg, args, Discord) => {
	var embed = new Discord.RichEmbed();

	let user = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[0]));
	if(!user) {embed.setColor(client.userLib.config.colors.err).setTitle('Ошибка!').setDescription(`Вы не указали пользователя!`);return msg.channel.send(embed);}
	
	let money = args[1];
	if (!money) {embed.setColor(client.userLib.config.colors.err).setTitle('Ошибка!').setDescription(`Вы не указали баланс!`);return msg.channel.send(embed);}
	if(!Number(money)) {embed.setColor(client.userLib.config.colors.err).setTitle('Ошибка!').setDescription(`Баланс должен быть числом`);return msg.channel.send(embed);}

	client.userLib.db.query("UPDATE account SET money = ? WHERE id = ?", [money, user.id]);
	embed.setColor(client.userLib.config.colors.suc).setTitle('Установка баланса').setDescription(`${msg.author}> установил ${user} баланс **${money}**`).setTimestamp();
	
	return msg.channel.send(embed);
};