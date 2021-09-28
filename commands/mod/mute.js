exports.help = {
	name: 'mute',
	description: 'Выдать мут участнику',
	extraPermissions: ['MANAGE_ROLES', 'MANAGE_CHANNELS']
};

exports.command = {
	name: exports.help.name,
	description: exports.help.description,
	options: [
		{
			name: 'участник',
			description: 'Участник сервера',
			type: 6,
			required: true,
		},
		{
			name: 'длительность',
			description: 'Длительность мута в минутах',
			type: 4,
		},
	]
};

exports.run = async (client, interaction) => {
	if (interaction.options.getInteger('длительность')) {
		if (interaction.options.getInteger('длительность') > 43200) return client.userLib.retError(interaction, 'Максимальное время мута - **43200 минут***(30 дней)*!');
		if (interaction.options.getInteger('длительность') < 1) return client.userLib.retError(interaction, 'Я не знаю где сейчас Тардис, так что назад во времени вернутся не получится.');
	}

	let mutedRole = await client.userLib.promise(
		client.userLib.db,
		client.userLib.db.queryValue,
		'SELECT mutedRole FROM guilds WHERE guildId = ?',
		[interaction.guildId]
	);
	mutedRole = mutedRole.res;
	let role = interaction.guild.roles.cache.get(mutedRole);

	if (!role) {
		await interaction.deferReply();

		let editEmbed = new client.userLib.discord.MessageEmbed()
			.setColor(client.userLib.colors.inf)
			.setTitle(`Создание роли...`)
			.setTimestamp()
			.setDescription(
				`${client.userLib.emoji.load} Создание роли\n${client.userLib.emoji.load} Установка прав для категорий\n${client.userLib.emoji.load} Установка прав для чатов\n${client.userLib.emoji.load} Установка прав для голосовых каналов`
			);

		const roleMsg = await interaction.channel.send({embeds: [editEmbed]});

		role = await interaction.guild.roles.create({
			name: 'MutedWhooves',
			color: 'GREY',
			permissions: [],
			reason: 'Создание мут роли для Хувза.'
		});

		editEmbed.setDescription(
			`${client.userLib.emoji.ready} Создание роли\n${client.userLib.emoji.load} Установка прав для категорий\n${client.userLib.emoji.load} Установка прав для чатов\n${client.userLib.emoji.load} Установка прав для голосовых каналов`
		);
		await roleMsg.edit({embeds: [editEmbed]});

		await interaction.guild.channels.fetch();

		for (let ch of interaction.guild.channels.cache.filter(ch => ch.type === 'GUILD_CATEGORY')) {
			await ch[1].permissionOverwrites.create(role, {SEND_MESSAGES: false, CONNECT: false});
		}

		editEmbed.setDescription(
			`${client.userLib.emoji.ready} Создание роли\n${client.userLib.emoji.ready} Установка прав для категорий\n${client.userLib.emoji.load} Установка прав для чатов\n${client.userLib.emoji.load} Установка прав для голосовых каналов`
		);

		await roleMsg.edit({embeds: [editEmbed]});

		for (const ch of interaction.guild.channels.cache.filter(ch => ch.type === 'GUILD_TEXT' && ch.parent && !ch.permissionOverwrites.cache.has(role.id))) {
			await ch[1].permissionOverwrites.create(role, {SEND_MESSAGES: false});
		}

		for (const ch of interaction.guild.channels.cache.filter(ch => ch.type === 'GUILD_TEXT' && !ch.parent)) {
			await ch[1].permissionOverwrites.create(role, {SEND_MESSAGES: false});
		}

		editEmbed.setDescription(
			`${client.userLib.emoji.ready} Создание роли\n${client.userLib.emoji.ready} Установка прав для категорий\n${client.userLib.emoji.ready} Установка прав для чатов\n${client.userLib.emoji.load} Установка прав для голосовых каналов`
		);

		await roleMsg.edit({ embeds: [editEmbed] });

		for (const ch of interaction.guild.channels.cache
			.filter(ch => ch.type === 'voice' && ch.parent && !ch.permissionOverwrites.cache.has(role.id)))
			await ch[1].permissionOverwrites.create(role, { CONNECT: false });

		for (const ch of interaction.guild.channels.cache.filter(ch => ch.type === 'GUILD_VOICE' && !ch.parent))
			await ch[1].permissionOverwrites.create(role.id, { CONNECT: false });

		editEmbed.setDescription(
			`${client.userLib.emoji.ready} Создание роли\n${client.userLib.emoji.ready} Установка прав для категорий\n${client.userLib.emoji.ready} Установка прав для чатов\n${client.userLib.emoji.ready} Установка прав для голосовых каналов`
		);

		await roleMsg.edit({ embeds: [editEmbed] });

		await client.userLib.db.update('guilds', { guildId: interaction.guildId, mutedRole: role.id }, () => {});

		editEmbed.setColor(client.userLib.colors.suc).setTitle(`Настройка завершена, выдаю мут!`);
		await roleMsg.edit({ embeds: [editEmbed] });
	}

	if (interaction.options.getMember('участник').roles.cache.has(role.id)) return client.userLib.retError(interaction, 'Участник уже замьючен!');

	await interaction.options.getMember('участник').roles.add(role, 'Выдача мута.');

	if (interaction.options.getInteger('длительность')) {
		let now = new Date();
		now.setMinutes(now.getMinutes() + interaction.options.getInteger('длительность'));

		client.userLib.db.upsert('mutes', { userId: interaction.options.getUser('участник').id, guildId: interaction.guildId, time: now }, () => {});
		client.userLib.sc.pushTask({ code: 'unMute', params: [role.id, interaction.options.getMember('участник')], time: now, timeAbsolute: true });

		client.userLib.retSuccess(interaction, `${interaction.options.getUser('участник')} **был замьючен!** ***||***  Чат будет доступен вновь <t:${Math.floor(now / 1000)}:R>`);
	} else {
		client.userLib.retSuccess(interaction, `${interaction.options.getUser('участник')} **был замьючен**!`);
	}

	await client.userLib.sendLogChannel('commandUse', interaction.guild, {
		user: {
			tag: interaction.user.tag,
			id: interaction.user.id,
		},
		channel: { id: interaction.channel.id },
		content: `выдача мута ${interaction.options.getUser('участник')}`,
	});
};
