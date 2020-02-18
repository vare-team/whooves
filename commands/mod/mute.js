exports.help = {
  name: "mute",
  description: "Замьютить участника",
	aliases: ['mt'],
  usage: "[@кто] [кол-во_мин]",
	dm: 0,
  tier: -1,
  cooldown: 5000
};

let emoji = {load:'<a:load:674326004990345217>', ready:'<a:checkmark:674326004252016695>', err:'<a:error:674326004872904733>'};
let error = 0;

exports.run = async (client, msg, args) => {
	if (isNaN(+args[1])) {client.userLib.retError(msg.channel, msg.author, 'Многа букав. Нихачу букавы читать.');return;}
	if (+args[1] > 43200) {client.userLib.retError(msg.channel, msg.author, 'Максимальное время мута - **43200 минут***(30 дней)*!');return;}
	if (+args[1] < 1) {client.userLib.retError(msg.channel, msg.author, 'Я не знаю где сейчас Тардис, так что назад во времени вернутся не получится.');return;}

	let mutedRole = await client.userLib.promise(client.userLib.db, client.userLib.db.queryValue, 'SELECT mutedRole FROM guilds WHERE guildId = ?', [msg.guild.id]);
	mutedRole = mutedRole.res;
	let role = msg.guild.roles.get(mutedRole);

	if (!role) {
		let editEmbed = new client.userLib.discord.RichEmbed()
			.setColor(client.userLib.colors.inf)
			.setTitle(`Создание роли...`)
			.setTimestamp()
			.setFooter(msg.author.tag, msg.author.avatarURL)
			.setDescription(`${emoji.load} Создание роли\n${emoji.load} Установка прав для категорий\n${emoji.load} Установка прав для чатов\n${emoji.load} Установка прав для голосовых каналов`);
		let msgs = await msg.channel.send(editEmbed);
		role = await msg.guild.createRole({name: 'MutedWhooves', color: 'GREY', permissions: 0}, 'Создание мут роли для Хувза.');
		editEmbed.setDescription(`${emoji.ready} Создание роли\n${emoji.load} Установка прав для категорий\n${emoji.load} Установка прав для чатов\n${emoji.load} Установка прав для голосовых каналов`);
		msgs.edit(editEmbed);

		for (const ch of msg.member.guild.channels.filter(ch => ch.type == 'category').array()) await ch.overwritePermissions(role, {SEND_MESSAGES: false, CONNECT: false}).catch(() => error = 1);
		editEmbed.setDescription(`${emoji.ready} Создание роли\n${emoji.ready} Установка прав для категорий\n${emoji.load} Установка прав для чатов\n${emoji.load} Установка прав для голосовых каналов`);
		if (!error) msgs.edit(editEmbed);

		for (const ch of msg.member.guild.channels.filter(ch => ch.type == 'text' && ch.parent && !ch.permissionOverwrites.has(role.id)).array()) await ch.overwritePermissions(role, {SEND_MESSAGES: false}).catch(() => error = 2);
		for (const ch of msg.member.guild.channels.filter(ch => ch.type == 'text' && !ch.parent).array()) await ch.overwritePermissions(role, {SEND_MESSAGES: false}).catch(() => error = 2);
		editEmbed.setDescription(`${emoji.ready} Создание роли\n${emoji.ready} Установка прав для категорий\n${emoji.ready} Установка прав для чатов\n${emoji.load} Установка прав для голосовых каналов`);
		if (!error) msgs.edit(editEmbed);

		for (const ch of msg.member.guild.channels.filter(ch => ch.type == 'voice' && ch.parent && !ch.permissionOverwrites.has(role.id)).array()) await ch.overwritePermissions(role, {CONNECT: false}).catch(() => error = 3);
		for (const ch of msg.member.guild.channels.filter(ch => ch.type == 'voice' && !ch.parent).array()) await ch.overwritePermissions(role, {CONNECT: false}).catch(() => error = 3);
		editEmbed.setDescription(`${emoji.ready} Создание роли\n${emoji.ready} Установка прав для категорий\n${emoji.ready} Установка прав для чатов\n${emoji.ready} Установка прав для голосовых каналов`);
		if (!error) msgs.edit(editEmbed);

		if (error) {
			role.delete('Ошибка при создании');
			editEmbed.setTitle('Ошибка при создании!').setDescription(`${emoji.err} Создание роли\n${emoji.err} Установка прав для категорий\n${emoji.err} Установка прав для чатов\n${emoji.err} Установка прав для голосовых каналов\n\n\n**Бот не смог выполнить настройку из-за не достатка прав!**`).setColor(client.userLib.colors.err);
			msgs.edit(editEmbed);
			return;
		}

		client.userLib.db.update('guilds', {guildId: msg.guild.id, mutedRole: role.id}, () => {});
		editEmbed.setColor(client.userLib.colors.suc).setTitle(`Настройка завершена, выдаю мут!`);
		msgs.edit(editEmbed);
	}

	msg.mentions.members.first().addRole(role, 'Выдача мута!');
	let now = new Date;
	now.setMinutes(now.getMinutes() + +args[1]);
	client.userLib.db.upsert('mutes', {userId: msg.magicMention.id, guildId: msg.guild.id, time: now}, () => {});
	client.userLib.sc.pushTask({code: 'unMute', params: [role.id, msg.mentions.members.first()], time: now, timeAbsolute: true});

	let embed = new client.userLib.discord.RichEmbed().setColor(client.userLib.colors.suc).setDescription(`Мут ${msg.magicMention} выдан!\nКоличество минут до снятия: ${args[1]}`).setTimestamp().setFooter(msg.author.tag, msg.author.avatarURL);
	msg.channel.send(embed);
	client.userLib.sendLogChannel("commandUse", msg.guild, { user: { tag: msg.author.tag, id: msg.author.id, avatar: msg.author.displayAvatarURL }, channel: { id: msg.channel.id }, content: `выдача мута ${msg.magicMention}`});

};