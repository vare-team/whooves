exports.help = {
  name: "mute",
  description: "Замьютить участника",
	aliases: ['mt'],
  usage: "[@кто] (кол-во мин)",
	dm: 0,
	args: 1,
  tier: -1,
  cooldown: 5000
};

exports.run = async (client, msg, args) => {
	if (!msg.mentions.users.first()) {
		client.userLib.retError(msg.channel, msg.author);
		return;
	}

	if (msg.mentions.members.first().id == msg.author.id) {
		client.userLib.retError(msg.channel, msg.author);
		return;
	}

	if (isNaN(+args[1])) {
		client.userLib.retError(msg.channel, msg.author);
		return;
	}

	let mutedRole = await client.userLib.promise(client.userLib.db, client.userLib.db.queryValue, 'SELECT mutedRole FROM guilds WHERE guildId = ?', [msg.guild.id]);
	mutedRole = mutedRole.res;

	let role = msg.guild.roles.get(mutedRole);

	if (!role) {
		let msgs = await msg.channel.send('Настраиваю роль. Ожидайте.');
		role = await msg.guild.createRole({name: 'MutedWhooves', color: 'GREY', permissions: 0}, 'Создание мут роли для Хувза.');
		for (const ch of msg.member.guild.channels.filter(ch => ch.type == 'category').array()) await ch.overwritePermissions(role, {VIEW_CHANNEL: false});
		for (const ch of msg.member.guild.channels.filter(ch => ch.type == 'text' && ch.parent && !ch.permissionOverwrites.has(role.id)).array()) await ch.overwritePermissions(role, {READ_MESSAGES: false});
		for (const ch of msg.member.guild.channels.filter(ch => ch.type == 'voice' && ch.parent && !ch.permissionOverwrites.has(role.id)).array()) await ch.overwritePermissions(role, {CONNECT: false});
		for (const ch of msg.member.guild.channels.filter(ch => ch.type == 'text' && !ch.parent).array()) await ch.overwritePermissions(role, {READ_MESSAGES: false});
		for (const ch of msg.member.guild.channels.filter(ch => ch.type == 'voice' && !ch.parent).array()) await ch.overwritePermissions(role, {CONNECT: false});
		client.userLib.db.update('guilds', {guildId: msg.guild.id, mutedRole: role.id}, () => {});
		msgs.edit('Настройка завершена. Выдаю мут.').then(ms => ms.delete(3000));
	}

	msg.mentions.members.first().addRole(role, 'Выдача мута!');
	client.userLib.sc.pushTask({code: 'unMute', params: [role.id, msg.mentions.members.first(), msg.guild], time: args[1] * 60 * 1000});

	//TODO база?

	msg.reply('мут выдан!');

};