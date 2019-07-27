let embed, args, av;

module.exports = (client, oldmsg, newmsg) => {
	
	if (oldmsg.author.bot || !oldmsg.content || !newmsg.content) return;

	client.db.queryValue('SELECT logchannel FROM servers WHERE id = ?', [oldmsg.guild.id], (err, logchannel) => {
		if (oldmsg.content == '') oldmsg.content = 'Что-то';
		if (newmsg.content == '') newmsg.content = 'Что-то';
		if (logchannel == '0') return;
    	let av = oldmsg.member.user.avatarURL;
    	if (!oldmsg.member.user.avatarURL) av = oldmsg.member.user.defaultAvatarURL;
		embed = new Discord.RichEmbed()
		.setColor(client.config.colors.inf)
		.setTitle('Изменённое сообщение')
		.setAuthor(oldmsg.author.tag, av)
		.addField('Старое сообщение', `\`\`\`${oldmsg.content.replace(new RegExp("\`",'g'),"")}\`\`\``)
		.addField('Новое сообщение', `\`\`\`${newmsg.content.replace(new RegExp("\`",'g'),"")}\`\`\``)
		.addField('Канал', `<#${oldmsg.channel.id}>`)
		.setTimestamp();
	    let sendlogchannel = client.channels.get(logchannel);
	    if (!sendlogchannel) return client.db.upsert(`servers`, {id: oldmsg.guild.id, logchannel: 0}, (err) => {});
   		sendlogchannel.send({embed}).catch(err => console.log(`\nОшибка!\nСервер: ${oldmsg.guild.name} (ID: ${oldmsg.guild.id})\nКанал: ${oldmsg.channel.name} (ID: ${oldmsg.channel.id})\nПользователь: ${oldmsg.author.tag} (ID: ${oldmsg.author.id})\nТекст ошибки: ${err}`));
	});
};