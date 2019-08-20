
exports.help = {
    name: "warn",
    description: "Выдать предупреждение участнику",
    usage: "warn [@кто]",
    flag: 2,
    cooldown: 5000   
}


let embed;

exports.run = (client, msg, args, Discord, link) => {

	if (!link) {
		if (!msg.mentions.members.first()) return;
		if (msg.mentions.members.first().id == msg.author.id) {embed = new client.discord.RichEmbed().setColor(client.config.colors.err).setTitle('Ошибка!').setDescription(`Администратор не может выдать предупреждение себе`).setTimestamp();return msg.channel.send({embed});}

		client.db.query(`UPDATE users SET warns = warns + ? WHERE id = ? AND serid = ?`, [1, msg.mentions.members.first().id, msg.guild.id], () => {
			client.db.queryValue('SELECT warns FROM users WHERE id = ? AND serid = ?', [msg.mentions.members.first().id, msg.guild.id], (err, warns) => {
				embed = new Discord.RichEmbed().setColor(client.config.colors.war).setTitle('Предупреждение выдано!').	setDescription(`Теперь у **${msg.mentions.members.first().user.tag}** **${warns}** предупреждений.`).setTimestamp().setFooter(msg.author.tag, msg.author.avatarURL);
				return msg.channel.send({embed});
			});
		});

	} else {
		msg.delete();
		client.db.query(`UPDATE users SET warns = warns + ? WHERE id = ? AND serid = ?`, [1, msg.author.id, msg.guild.id], () => {
			client.db.queryValue('SELECT warns FROM users WHERE id = ? AND serid = ?', [msg.author.id, msg.guild.id], (err, warns) => {
				embed = new Discord.RichEmbed().setColor(client.config.colors.war).setTitle('Предупреждение выдано!').	setDescription(`Теперь у **${msg.author.tag}** **${warns}** предупреждений.`).addField('Причина', 'В сообщении обнаружена ссылка').setTimestamp();
				return msg.channel.send({embed}).then(msg => {msg.delete(15000);})
			});
		});
	}
}