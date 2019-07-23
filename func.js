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
	'embed': (type, text, status) => {
		let embed = new Discord.RichEmbed();
		if(!type) return console.error('Error! Тип не указан');
	  
		switch (type) {
	  
		  case "error":
			embed.setTitle('Ошибка!');
			embed.setColor('#FF0000');
		  break;
	  
		  case "notification":
			embed.setTitle('Уведомление!');
			embed.setColor('#33FF33')
		  break;
	  
		  case "warning":
			embed.setTitle('Уведомление!');
			embed.setColor('#33FF33')
		  break;
			  
		  default:
			embed.setTitle('unknown embed!');
			embed.setColor(config.color)
		}
	  
		if(status) embed.setAthor(message.guild.name, message.guild.iconURL);
		if(text) embed.setDescription(text);
		return embed;
	}
}