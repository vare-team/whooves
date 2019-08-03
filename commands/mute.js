exports.help = {
    name: "mute",
    description: "Замьютить участника",
    usage: "mute [@кто] (кол-во мин)",
    flag: 2,
    cooldown: 5000
};

exports.run = (client, msg, args, Discord) => {
	var embed = new Discord.RichEmbed();

	var user = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[0]));
	if (!user) {embed.setColor(client.userLib.config.colors.err).setTitle('Ошибка!').setDescription('Вы не указали участника сервера!'); return msg.channel.send(embed);}
	if (msg.author.id == user.id) {embed.setColor(client.userLib.config.colors.err).setTitle('Ошибка!').setDescription('Вы не можете замутить самого себя!'); return msg.channel.send(embed);}
	if (user.user.bot) {embed.setColor(client.userLib.config.colors.err).setTitle('Ошибка!').setDescription('Вы не можете замутить бота!'); return msg.channel.send(embed);}
	
	var time = args[1];
	if (!time) {embed.setColor(client.userLib.config.colors.err).setTitle('Ошибка!').setDescription('Вы не указали время мута!'); return msg.channel.send(embed);}
	if (time > 60 || time < 0) {embed.setColor(client.userLib.config.colors.err).setTitle('Ошибка!').setDescription('Нельзя выдать мут больше чем на час!'); return msg.channel.send(embed);}

	client.userLib.db.queryValue('SELECT muterole FROM guilds WHERE id = ? AND serid = ?', [user.id, msg.guild.id], (err, muterole) => {
		if (parseInt(muterole)) {embed
				.setColor(client.userLib.config.colors.err)
				.setTitle('Ошибка!')
				.setDescription(`У <@${user.id}> уже есть мут`);
			return msg.channel.send({embed});}

		msg.delete();
		msg.guild.createRole({
			name: `Akin | Mute | ${user.user.username}`
		}).then(role => {
			msg.member.guild.channels.filter(channel => channel.type == 'text').forEach(channel => channel.overwritePermissions(role, {
				SEND_MESSAGES: false
			}));
	
			msg.member.guild.channels.filter(channel => channel.type == 'voice').forEach(channel => channel.overwritePermissions(role, {
				SPEAK: false
			}));
	
			user.addRole(role);
			embed
				.setColor(client.userLib.config.colors.suc)
				.setTitle('Участнику выдан мут!')
				.setDescription(`<@${user.id}> отправлен в мут`);
			if (time) embed.setDescription(`<@${user.id}> отправлен в мут на **${time}** мин.`);
	
			client.userLib.db.query(`UPDATE guilds SET muterole = ? WHERE id = ? AND serid = ?`, [role.id, user.id, msg.guild.id], () => {
				if (time) {
					setTimeout(function() {

						client.userLib.db.queryValue('SELECT muterole FROM guilds WHERE id = ? AND serid = ?', [user.id, msg.guild.id], (err, muterole) => {
							if (muterole == '0') return;
							if (client.guilds.get(msg.guild.id).roles.get(muterole)) return;
							role.delete();
							client.userLib.db.query(`UPDATE guilds SET muterole = 0 WHERE id = ? AND serid = ?`, [user.id, msg.guild.id], () => {});
						});

					}, time*60*1000)
				}
				embed.setTimestamp();
				return msg.channel.send(embed).then(msg => msg.delete(15000));
			});
		});
	});
};