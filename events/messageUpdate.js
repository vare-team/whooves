let embed, av;

module.exports = (client, oldmsg, newmsg) => {
	if (oldmsg.author.bot || !oldmsg.content || !newmsg.content) return;

	client.userLib.db.queryValue('SELECT logchannel FROM guilds WHERE id = ?', [oldmsg.guild.id || newmsg.guild.id], (err, logchannel) => {
		if (!oldmsg.content) oldmsg.content = 'Что-то';
		if (!newmsg.content) newmsg.content = 'Что-то';
		if (oldmsg.content === newmsg.content) return;
		if (logchannel == '0') return;
		
    	embed = new client.userLib.discord.RichEmbed()
			.setColor(client.userLib.config.colors.inf)
			.setTitle('Изменённое сообщение')
			.setAuthor(oldmsg.author.tag || newmsg.author.tag, oldmsg.member.user.displayAvatarURL || newmsg.member.user.displayAvatarURL)
			.addField('Старое сообщение', `\`\`\`${oldmsg.content.replace(new RegExp("\`",'g'),"")}\`\`\``)
			.addField('Новое сообщение', `\`\`\`${newmsg.content.replace(new RegExp("\`",'g'),"")}\`\`\``)
			.addField('Канал', `<#${oldmsg.channel.id || newmsg.channel.id}>`)
			.setTimestamp();
		
		let sendlogchannel = client.channels.get(logchannel);
	    if (!sendlogchannel) return client.userLib.db.upsert(`guilds`, {id: oldmsg.guild.id || newmsg.guild.id, logchannel: 0}, (err) => { if(err) throw err; });
   		sendlogchannel.send(embed).catch(err => console.log(`\nОшибка!\nСервер: ${oldmsg.guild.name || newmsg.guild.name} (ID: ${oldmsg.guild.id || newmsg.guild.id})\nКанал: ${oldmsg.channel.name || newmsg.channel.name} (ID: ${oldmsg.channel.id || newmsg.channel.id})\nПользователь: ${oldmsg.author.tag || newmsg.author.tag} (ID: ${oldmsg.author.id || newmsg.author.id})\nТекст ошибки: ${err}`));
	});
};