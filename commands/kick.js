
exports.help = {
    name: "kick",
    description: "Кикнуть участника (только от 3 варнов)",
    usage: "kick [@кто]",
    flag: 2,
    cooldown: 5000
}

exports.run = (client, msg, args, Discord) => {
	if (!msg.mentions.members.first()) return;
	
	client.db.queryValue('SELECT warns FROM users WHERE id = ? AND serid = ?', [msg.mentions.members.first().id, msg.guild.id], (err, warns) => {

		if (warns >= 3) {
			client.db.query(`UPDATE users SET warns = 0 WHERE id = ? AND serid = ?`, [msg.mentions.members.first().id, msg.guild.id])
			embed = new Discord.RichEmbed().setColor(client.config.colors.inf).setTitle('Участник сервера кикнут!').setDescription(`${msg.mentions.members.first().user.tag} кикнут.`).setTimestamp().setFooter(msg.author.tag, msg.author.avatarURL);
			return msg.channel.send({embed});
		} else {
			embed = new Discord.RichEmbed().setColor(client.config.colors.err).setTitle('Ошибка!');
			if (!warns || warns == 0) embed.setDescription(`Для кика необходимо минимум **3** варна.\nУ **${msg.mentions.members.first().user.tag}** их **нет**`);
			embed.setDescription(`Для кика необходимо минимум **3** варна.\nУ **${msg.mentions.members.first().user.tag}** их **${warns}**`)
			.setTimestamp();
			return msg.channel.send({embed});
		}

	});
}