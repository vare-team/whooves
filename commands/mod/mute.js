exports.help = {
	name: 'mute',
	description: 'Замьютить участника',
	aliases: ['mt'],
	usage: [
		{type: 'user', opt: 0},
		{type: 'text', opt: 0, name: 'кол-во минут'}],
	dm: 0,
	tier: -1,
	cooldown: 5
};

exports.run = async (client, msg, args) => {
	if (!msg.guild.me.hasPermission('MANAGE_ROLES')
		|| msg.guild.channels.filter(
			el => !(el.manageable && el.permissionsFor(client.user).has('MANAGE_ROLES'))
		).size) {
		client.userLib.retError(msg, 'Мне не доступна такая власть.');
		return;
	}

	if (isNaN(+args[1])) {
		client.userLib.retError(msg, 'Многа букав. Нихачу букавы читать.');
		return;
	}
	if (+args[1] > 43200) {
		client.userLib.retError(msg, 'Максимальное время мута - **43200 минут***(30 дней)*!');
		return;
	}
	if (+args[1] < 1) {
		client.userLib.retError(msg, 'Я не знаю где сейчас Тардис, так что назад во времени вернутся не получится.');
		return;
	}

	let mutedRole = await client.userLib.promise(client.userLib.db, client.userLib.db.queryValue, 'SELECT mutedRole FROM guilds WHERE guildId = ?', [msg.guild.id]);
	mutedRole = mutedRole.res;
	let role = msg.guild.roles.get(mutedRole);

	if (!role) {
		let editEmbed = new client.userLib.discord.MessageEmbed()
			.setColor(client.userLib.colors.inf)
			.setTitle(`Создание роли...`)
			.setTimestamp()
			.setFooter(msg.author.tag, msg.author.displayAvatarURL())
			.setDescription(`${client.userLib.emoji.load} Создание роли\n${client.userLib.emoji.load} Установка прав для категорий\n${client.userLib.emoji.load} Установка прав для чатов\n${client.userLib.emoji.load} Установка прав для голосовых каналов`);

		let msgs = await msg.channel.send(editEmbed);

		role = await msg.guild.createRole({name: 'MutedWhooves', color: 'GREY', permissions: 0}, 'Создание мут роли для Хувза.');
		editEmbed.setDescription(`${client.userLib.emoji.ready} Создание роли\n${client.userLib.emoji.load} Установка прав для категорий\n${client.userLib.emoji.load} Установка прав для чатов\n${client.userLib.emoji.load} Установка прав для голосовых каналов`);
		msgs.edit(editEmbed);

		for (const ch of msg.member.guild.channels.filter(ch => ch.type == 'category').array())
			await ch.overwritePermissions(role, {SEND_MESSAGES: false, CONNECT: false});
		editEmbed.setDescription(`${client.userLib.emoji.ready} Создание роли\n${client.userLib.emoji.ready} Установка прав для категорий\n${client.userLib.emoji.load} Установка прав для чатов\n${client.userLib.emoji.load} Установка прав для голосовых каналов`);
		msgs.edit(editEmbed);

		for (const ch of msg.member.guild.channels.filter(ch => ch.type == 'text' && ch.parent && !ch.permissionOverwrites.has(role.id)).array())
			await ch.overwritePermissions(role, {SEND_MESSAGES: false});
		for (const ch of msg.member.guild.channels.filter(ch => ch.type == 'text' && !ch.parent).array())
			await ch.overwritePermissions(role, {SEND_MESSAGES: false});
		editEmbed.setDescription(`${client.userLib.emoji.ready} Создание роли\n${client.userLib.emoji.ready} Установка прав для категорий\n${client.userLib.emoji.ready} Установка прав для чатов\n${client.userLib.emoji.load} Установка прав для голосовых каналов`);
		msgs.edit(editEmbed);

		for (const ch of msg.member.guild.channels.filter(ch => ch.type == 'voice' && ch.parent && !ch.permissionOverwrites.has(role.id)).array())
			await ch.overwritePermissions(role, {CONNECT: false});
		for (const ch of msg.member.guild.channels.filter(ch => ch.type == 'voice' && !ch.parent).array())
			await ch.overwritePermissions(role, {CONNECT: false});
		editEmbed.setDescription(`${client.userLib.emoji.ready} Создание роли\n${client.userLib.emoji.ready} Установка прав для категорий\n${client.userLib.emoji.ready} Установка прав для чатов\n${client.userLib.emoji.ready} Установка прав для голосовых каналов`);
		msgs.edit(editEmbed);

		client.userLib.db.update('guilds', {guildId: msg.guild.id, mutedRole: role.id}, () => {});
		editEmbed.setColor(client.userLib.colors.suc).setTitle(`Настройка завершена, выдаю мут!`);
		msgs.edit(editEmbed);
	}

	msg.magicMention.addRole(role, 'Выдача мута!');
	let now = new Date;
	now.setMinutes(now.getMinutes() + +args[1]);
	client.userLib.db.upsert('mutes', {userId: msg.magicMention.id, guildId: msg.guild.id, time: now}, () => {});
	client.userLib.sc.pushTask({code: 'unMute', params: [role.id, msg.magicMention], time: now, timeAbsolute: true});

	let embed = new client.userLib.discord.MessageEmbed().setColor(client.userLib.colors.suc).setDescription(`Мут ${msg.magicMention} выдан!\nКоличество минут до снятия: ${args[1]}`).setTimestamp().setFooter(msg.author.tag, msg.author.displayAvatarURL());
	msg.channel.send(embed);
	client.userLib.sendLogChannel('commandUse', msg.guild, {
		user: {
			tag: msg.author.tag,
			id: msg.author.id,
			avatar: msg.author.displayAvatarURL()
		}, channel: {id: msg.channel.id}, content: `выдача мута ${msg.magicMention}`
	});

};