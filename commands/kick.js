exports.help = {
    name: "kick",
    description: "Кикнуть участника (только от 3 варнов)",
    usage: "kick [@кто]",
    flag: 2,
    cooldown: 5000
};

exports.run = (client, msg, args, Discord) => {
	var embed = new Discord.RichEmbed();

	var user = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[0]));
	if(!user) { embed.setColor(client.userLib.config.colors.err).setTitle('Ошибка!').setDescription('Вы не указали участника сервера!'); }
	client.userLib.db.queryValue('SELECT warns FROM users WHERE id = ? AND serid = ?', [user.id, msg.guild.id], (err, warns) => {
		if (warns >= 3) {
			embed.setColor(client.config.colors.inf).setTitle('Изгнание с сервера').setDescription(`${user} кикнут.`).setTimestamp().setFooter(msg.author.tag, msg.author.avatarURL);
			return msg.channel.send(embed);
		} else {
			embed.setColor(client.userLib.config.colors.err).setTitle('Ошибка!');
			if (!warns || warns == 0) embed.setDescription(`Для кика необходимо минимум **3** варна.\nУ **${user.user.tag}** их **нет**`);
			embed.setDescription(`Для кика необходимо минимум **3** варна.\nУ **${user.user.tag}** их **${warns}**.`)
			.setTimestamp();
			return msg.channel.send(embed);
		}
	});
};