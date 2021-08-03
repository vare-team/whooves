exports.help = {
	name: 'lookup',
	description: 'Информация о пользователе, гильдии или приглашении.',
	dm: 1,
	tier: 0,
	cooldown: 5,
};

exports.command = {
	name: exports.help.name,
	description: exports.help.description,
	options: [
		{
			name: 'пользователь',
			description: 'Получить инофрмацию о пользователе',
			type: 1,
			options: [
				{
					name: 'пользователь',
					description: 'Пользователь',
					type: 6,
					required: true,
				},
			],
		},
		{
			name: 'id',
			description: 'Получить инофрмацию о ID',
			type: 1,
			options: [
				{
					name: 'id',
					description: 'ID публичной гильдии, приглашения или пользователя',
					type: 3,
					required: true,
				},
			],
		},
	],
};

exports.run = async (client, interaction) => {
	let object;

	if (interaction.data.options.hasOwnProperty('пользователь'))
		object = await client.users.fetch(interaction.data.options['пользователь'].options[0].value).catch(() => 0);
	else if (interaction.data.options.hasOwnProperty('id')) {
		if (/([0-9]){17,18}/.test(interaction.data.options['id'].options[0].value))
			object = await client.users.fetch(interaction.data.options['id'].options[0].value).catch(() => 0);
		if (!object) object = await client.fetchInvite(interaction.data.options['id'].options[0].value).catch(() => 0);
		if (!object)
			object = await client.fetchGuildPreview(interaction.data.options['id'].options[0].value).catch(() => 0);
	}

	if (!object) {
		client.userLib.retError(interaction, 'Пользователя/Приглашения/Гильдии с таким ID не найдено.');
		return;
	}

	let embed = new client.userLib.discord.MessageEmbed().setColor(client.userLib.colors.inf).setTimestamp();

	switch (object.constructor.name) {
		case 'ClientUser':
		case 'User':
			object.member = await client.guilds
				.resolve(interaction.guild_id)
				.members.fetch(object.id)
				.catch(() => 0);
			embed
				.setTitle(object.bot ? 'Бот' : 'Пользователь')
				.setAuthor(object.tag, object.displayAvatarURL({ dynamic: true }))
				.addField('Дата регистрации:', `<t:${Math.floor(object.createdAt / 1000)}:R>`, true)
				.setThumbnail(object.displayAvatarURL({ dynamic: true }));
			if (object.member)
				embed.addField(
					'Дата присоединения к этой гильдии:',
					`<t:${Math.floor(object.member.joinedTimestamp / 1000)}:R>`,
					true
				);
			if (object.flags) embed.addField('Значки:', '```' + object.flags.toArray() + '```');
			break;
		case 'Invite':
			embed
				.setTitle('Приглашение')
				.setAuthor(
					object.guild.name,
					`https://cdn.discordapp.com/icons/${object.guild.id}/${object.guild.icon}.jpg?size=128`
				)
				.addField('ID гильдии:', '``' + object.guild.id + '``', true)
				.addField('Канал:', '``#' + object.channel.name + '``', true)
				.addField('Кол-во участников:', '``' + object.memberCount + '``')
				.addField('Пригласивший:', '``' + `${object.inviter.tag} (ID: ${object.inviter.id})` + '``');
			break;
		case 'GuildPreview':
			embed
				.setTitle('Публичная гильдия')
				.setAuthor(object.name, `https://cdn.discordapp.com/icons/${object.id}/${object.icon}.jpg?size=128`)
				.addField('Кол-во участников:', '``' + object.approximateMemberCount + '``', true)
				.addField('Кол-во эмоджи:', '``' + object.emojis.size + '``', true)
				.addField('Опции:', '```' + object.features + '```');
	}

	client.userLib.replyInteraction(interaction, embed);
};
