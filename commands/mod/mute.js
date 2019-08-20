
exports.help = {
    name: "mute",
    description: "Замьютить участника",
    usage: "mute [@кто] (кол-во мин)",
    flag: 2,
    cooldown: 5000
}

let embed;

exports.run = (client, msg, args, Discord) => {
	
	if (!msg.mentions.members.first()) return;

	if (msg.author.id == msg.mentions.members.first().id) {embed = new Discord.RichEmbed().setColor(client.config.colors.err).setTitle('Ошибка!').setDescription('Администратор не может замутить сам себя!').setTimestamp();return msg.channel.send({embed});}


	if (parseInt(args[2]) && (parseInt(args[2]) > 60 || parseInt(args[2]) < 0)) {embed = new Discord.RichEmbed().setColor(client.config.colors.err).setTitle('Ошибка!').setDescription('Нельзя выдать мут больше чем на час!').setTimestamp();return msg.channel.send({embed});}


	client.db.queryValue('SELECT muterole FROM users WHERE id = ? AND serid = ?', [msg.mentions.members.first().id, msg.guild.id], (err, muterole) => {

		if (parseInt(muterole)) {embed = new Discord.RichEmbed()
			.setColor(client.config.colors.err)
			.setTitle('Ошибка!')
			.setDescription(`У <@${msg.mentions.members.first().id}> уже есть мут`)
			.setTimestamp();
			console.log(`Suka is "${muterole}"`)
			return msg.channel.send({embed});}

		msg.delete();
	
		msg.guild.createRole({
			name: `Mute ${msg.mentions.members.first().user.username}`
		}).then(role => {
	
			msg.member.guild.channels.filter(channel => channel.type == 'text').forEach(channel => channel.overwritePermissions(role, {
				SEND_MESSAGES: false
			}))
	
			msg.member.guild.channels.filter(channel => channel.type == 'voice').forEach(channel => channel.overwritePermissions(role, {
				SPEAK: false
			}))
	
			msg.mentions.members.first().addRole(role);
			
			embed = new Discord.RichEmbed()
				.setColor(client.config.colors.suc)
				.setTitle('Участнику выдан мут!')
				.setDescription(`<@${msg.mentions.members.first().id}> отправлен в мут`);
			if (parseInt(args[2])) embed.setDescription(`<@${msg.mentions.members.first().id}> отправлен в мут на **${parseInt(args[2])}** мин.`);
	
			client.db.query(`UPDATE users SET muterole = ? WHERE id = ? AND serid = ?`, [role.id, msg.mentions.members.first().id, msg.guild.id], () => {

				if (parseInt(args[2])) {
					setTimeout(function() {

						client.db.queryValue('SELECT muterole FROM users WHERE id = ? AND serid = ?', [msg.mentions.members.first().id, msg.guild.id], (err, muterole) => {
							if (muterole == '0') return;
							if (client.guilds.get(msg.guild.id).roles.get(muterole)) return;
							role.delete();
							client.db.query(`UPDATE users SET muterole = 0 WHERE id = ? AND serid = ?`, [msg.mentions.members.first().id, msg.guild.id], () => {});
						});

					}, parseInt(args[2])*60*1000)
				}
				embed.setTimestamp();
				return msg.channel.send({embed}).then(msg => msg.delete(5000));

			});
		});
	});

}