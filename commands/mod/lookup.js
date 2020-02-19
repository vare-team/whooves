exports.help = {
	name: "lookup",
	description: "Получить информацию огильдии или приглашения по ID.",
	aliases: ['lu', 'lk'],
	usage: "[id]",
	dm: 0,
	tier: -1,
	cooldown: 5
};

exports.run = async (client, msg, args) => {
	let object;

	if (/([0-9]){17,18}/.test(args[0])) object = await client.fetchUser(args[0]).catch(() => {});
	else object = await client.fetchInvite(args[0]).catch(() => {});

	if (!object) {
		client.userLib.retError(msg.channel, msg.author, 'Гильдии/Приглашения с таким ID не найдено.');
		return;
	}

	let embed = new client.userLib.discord.RichEmbed()
		.setColor(client.userLib.colors.inf)
		.setTimestamp()
		.setFooter(msg.author.tag, msg.author.avatarURL);

	switch (object.constructor.name) {
		case 'User':
			embed
				.setTitle('Пользователь')
				.setDescription(`Название: ${object.tag}\nБот: ${object.bot ? 'да' : 'нет'}\nАккаунт зарегиестрирован: ${client.userLib.moment(object.createdAt, "WWW MMM DD YYYY HH:mm:ss").fromNow()}\nТочная дата: ${object.createdAt}`)
				.setThumbnail(object.displayAvatarURL);
			break;
		case 'Invite':
			embed
				.setTitle('Приглашение')
				.setDescription(`Название гильдии: ${object.guild.name}\nКанал: #${object.channel.name}${object.inviter ? `\nПригласивший: ${object.inviter.tag}(ID: ${object.inviter.id})` : ''}`);
			break;
	}

	msg.channel.send(embed);
};