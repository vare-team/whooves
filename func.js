module.exports = {
	'sendlog': (client, guild) => {
		client.db.queryValue('SELECT logchannel FROM servers WHERE id = ?', [guild.id], (err, logchannel) =>   {
			if (logchannel == '0') return;

			let av = member.user.avatarURL ? member.user.avatarURL : member.user.defaultAvatarURL;

			let embed = new client.discord.RichEmbed()
				.setColor(client.config.colors.inf)
				.setTitle('Новый участник на сервере!')
				.setAuthor(member.user.tag, av)
				.setDescription(`Аккаунт зарегистрирован **${moment(member.user.createdAt, "WWW MMM DD YYYY HH:mm:ss").fromNow()}**`)
				.setFooter(`ID: ${member.user.id}`)
				.setTimestamp();
			
			let sendlogchannel = client.channels.get(logchannel);
			if (!sendlogchannel) return client.db.upsert(`servers`, {id: guild.id, logchannel: 0}, (err) => {});

			sendlogchannel.send({embed}).catch(err => console.log(`\nОшибка!\nСервер: ${guild.name} (ID: ${guild.id})\nПользователь: ${member.user.tag} (ID: ${member.user.id})\nТекст ошибки: ${err}`));
		})
	},
	'logiSend': (guild, type, text) => {
		let embed = new Discord.RichEmbed();

		if(!type) return console.error('Error! Тип не указан');
		switch (type) {
		  case "memberAdd":
			embed.setTitle('Пользователь присоединился!');
			embed.setColor('#33af33');
		  break;
	  
		  case "memberRemove":
			embed.setTitle('Пользователь вышел!');
			embed.setColor('#ff9000')
		  break;
	  
		  case "memberBan":
			embed.setTitle('Забанен!');
			embed.setColor('#FF4000')
		  break;
			  
		  default:
			embed.setTitle('unknown logi!');
			embed.setColor(config.color)
		}
		if(text) embed.setDescription(text);

		client.db.queryValue('SELECT logchannel FROM guilds WHERE id = ?', [guild.id], (err, logchannel) => {
			if(err) throw err;
			if(!logchannel) return;
			return client.channels.get(logchannel).send(embed);
		});
	}
}