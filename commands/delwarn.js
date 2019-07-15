
exports.help = {
    name: "delwarn",
    description: "Снять предупреждение с участника",
    usage: "delwarn [@кто]",
    flag: 2,
    cooldown: 15000
}


let embed;

exports.run = (client, msg, args, Discord) => {

	if (!msg.mentions.members.first()) return;

	if (msg.mentions.members.first().id == msg.author.id) {embed = new client.discord.RichEmbed().setColor(client.config.colors.err).setTitle('Ошибка!').setDescription(`Администратор не может снять предупреждение с себя`).setTimestamp();return msg.channel.send({embed});}

	client.db.queryValue('SELECT warns FROM users WHERE id = ? AND serid = ?', [msg.mentions.members.first().id, msg.guild.id], (err, iswarns) => {
		if (iswarns < 1) {embed = new client.discord.RichEmbed().setColor(client.config.colors.err).setTitle('Ошибка!').setDescription(`У <@${msg.mentions.members.first().id}> нет предупреждений`).setTimestamp();return msg.channel.send({embed});}
		client.db.query(`UPDATE users SET warns = warns - ? WHERE id = ? AND serid = ?`, [1, msg.mentions.members.first().id, msg.guild.id], () => {

			embed = new Discord.RichEmbed().setColor(client.config.colors.war).setTitle('Предупреждения снято!').setDescription(`Теперь у **${msg.mentions.members.first().user.tag}** **${iswarns - 1}** предупреждений.`).setTimestamp().setFooter(msg.author.tag, msg.author.avatarURL);
			return msg.channel.send({embed});

		});
	});

}