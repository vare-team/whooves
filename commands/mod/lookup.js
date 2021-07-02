exports.help = {
	name: 'lookup',
	description: 'Получить информацию о пользователе или приглашении по ID.',
	aliases: ['lu', 'lk'],
	usage: [{ type: 'text', opt: 0, name: 'id' }],
	dm: 1,
	tier: 0,
	cooldown: 5,
};

exports.run = async (client, msg, args) => {
	let object;
	if (/([0-9]){17,18}/.test(args[0])) object = await client.users.fetch(args[0]).catch(() => 0);
	else object = await client.fetchInvite(args[0]).catch(() => 0);

	if (!object) {
		client.userLib.retError(msg, 'Пользователя/Приглашения с таким ID не найдено.');
		return;
	}

	let embed = new client.userLib.discord.MessageEmbed()
		.setColor(client.userLib.colors.inf)
		.setTimestamp()
		.setFooter(msg.author.tag, msg.author.displayAvatarURL());

	switch (object.constructor.name) {
		case 'User':
			let date = new Date(object.createdAt),
				member = msg.guild.members.cache.get(object.id);
			embed
				.setTitle('Пользователь')
				.setDescription(
					`Имя: ${object.tag}\nБот: ${object.bot ? 'да' : 'нет'}\nАккаунт зарегистрирован: ${client.userLib
						.moment(object.createdAt, 'WWW MMM DD YYYY HH:mm:ss')
						.fromNow()}\nТочная дата: ${
						('00' + date.getDate()).slice(-2) +
						'.' +
						('00' + (date.getMonth() + 1)).slice(-2) +
						'.' +
						date.getFullYear() +
						' ' +
						('00' + date.getHours()).slice(-2) +
						':' +
						('00' + date.getMinutes()).slice(-2) +
						':' +
						('00' + date.getSeconds()).slice(-2)
					}\n${
						member
							? `Дата присоединения к этой гильдии: ${
									('00' + member.joinedAt.getDate()).slice(-2) +
									'.' +
									('00' + (member.joinedAt.getMonth() + 1)).slice(-2) +
									'.' +
									member.joinedAt.getFullYear() +
									' ' +
									('00' + member.joinedAt.getHours()).slice(-2) +
									':' +
									('00' + member.joinedAt.getMinutes()).slice(-2) +
									':' +
									('00' + member.joinedAt.getSeconds()).slice(-2)
							  }`
							: ''
					}`
				)
				.setThumbnail(object.displayAvatarURL({ dynamic: true }));
			break;
		case 'Invite':
			embed
				.setTitle('Приглашение')
				.setDescription(
					`Название гильдии: ${object.guild.name}\nID гильдии: ${object.guild.id}\nКанал: #${object.channel.name}${
						object.inviter ? `\nПригласивший: ${object.inviter.tag}(ID: ${object.inviter.id})` : ''
					}`
				);
			break;
	}

	msg.channel.send(embed);
};
