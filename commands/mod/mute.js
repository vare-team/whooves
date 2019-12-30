exports.help = {
  name: "mute",
  description: "Замьютить участника",
	aliases: ['mt'],
  usage: "[@кто] (кол-во мин)",
	dm: 0,
	args: 1,
	mention: 1,
  tier: -1,
  cooldown: 5000
};

exports.run = async (client, msg, args) => {
	if (isNaN(+args[1])) {client.userLib.retError(msg.channel, msg.author, 'Многа букав. Нихачу букавы читать.');return;}
	if (+args[1] > 43200) {client.userLib.retError(msg.channel, msg.author, 'Максимальное время мута - **43200 минут***(30 дней)*!');return;}
	if (+args[1] < 1) {client.userLib.retError(msg.channel, msg.author, 'Я не знаю где сейчас Тардис, так что назад во времени вернутся не получится.');return;}

	let mutedRole = await client.userLib.promise(client.userLib.db, client.userLib.db.queryValue, 'SELECT mutedRole FROM guilds WHERE guildId = ?', [msg.guild.id]);
	mutedRole = mutedRole.res;
	let role = msg.guild.roles.get(mutedRole);

	if (!role) {
		let editEmbed = new client.userLib.discord.RichEmbed().setColor(client.userLib.colors.war).setTitle(`Я не нашёл настроенной роли. Создаю роль, ожидайте...`).setTimestamp().setFooter(msg.author.tag, msg.author.avatarURL);
		let msgs = await msg.channel.send(embed);
		role = await msg.guild.createRole({name: 'MutedWhooves', color: 'GREY', permissions: 0}, 'Создание мут роли для Хувза.');
		for (const ch of msg.member.guild.channels.filter(ch => ch.type == 'category').array()) await ch.overwritePermissions(role, {SEND_MESSAGES: false, CONNECT: false});
		for (const ch of msg.member.guild.channels.filter(ch => ch.type == 'text' && ch.parent && !ch.permissionOverwrites.has(role.id)).array()) await ch.overwritePermissions(role, {SEND_MESSAGES: false});
		for (const ch of msg.member.guild.channels.filter(ch => ch.type == 'voice' && ch.parent && !ch.permissionOverwrites.has(role.id)).array()) await ch.overwritePermissions(role, {CONNECT: false});
		for (const ch of msg.member.guild.channels.filter(ch => ch.type == 'text' && !ch.parent).array()) await ch.overwritePermissions(role, {SEND_MESSAGES: false});
		for (const ch of msg.member.guild.channels.filter(ch => ch.type == 'voice' && !ch.parent).array()) await ch.overwritePermissions(role, {CONNECT: false});
		client.userLib.db.update('guilds', {guildId: msg.guild.id, mutedRole: role.id}, () => {});
		editEmbed.setColor(client.userLib.colors.suc).setTitle(`Настройка завершена, выдаю мут!`);
		msgs.edit(editEmbed).then(ms => ms.delete(3000));
	}

	msg.mentions.members.first().addRole(role, 'Выдача мута!');
	let now = new Date;
	now.setMinutes(now.getMinutes() + +args[1]);
	client.userLib.db.insert('mutes', {userId: msg.mentions.users.first().id, guildId: msg.guild.id, time: now}, () => {});
	client.userLib.sc.pushTask({code: 'unMute', params: [role.id, msg.mentions.members.first()], time: now, timeAbsolute: true});

	let embed = new client.userLib.discord.RichEmbed().setColor(client.userLib.colors.suc).setDescription(`Мут ${msg.mentions.users.first()} выдан!\nКоличество минут до снятия: ${args[1]}`).setTimestamp().setFooter(msg.author.tag, msg.author.avatarURL);
	msg.channel.send(embed);
};