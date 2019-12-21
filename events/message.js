module.exports = async (client, msg) => {
	if (msg.author.bot) return;
	msg.flags = {};

	let prefix = msg.channel.type == 'dm' ? 'w.' : (await client.userLib.promise(client.userLib.db, client.userLib.db.queryValue, 'SELECT prefix FROM guilds WHERE guildId = ?', [msg.guild.id])).res || 'w.';
	msg.flags.prefix = prefix;

	if(msg.mentions.users.first() && msg.mentions.users.first().id == client.user.id) {
		msg.reply(`Мой префикс \`\`${prefix}\`\`\nМожешь написать \`\`${prefix}help\`\` для помощи.`);
		return;
	}

	if(!msg.content.toLowerCase().startsWith(prefix)) {
		client.userLib.db.query('INSERT INTO users (userId, tag) VALUES (?, ?) ON DUPLICATE KEY UPDATE xp = xp + ?', [msg.author.id, msg.author.tag, client.userLib.randomIntInc(1,5)]);
		return;
	}

	const [command, ...args] = msg.content.slice(prefix.length).trim().split(/ +/g);
	const cmd = client.commands.get(command.toLowerCase()) || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(command.toLowerCase()));
	if (!cmd) return;

	if(msg.channel.type != 'dm' && !msg.channel.memberPermissions(client.user).has('ADMINISTRATOR')) {
		msg.reply('Хмм... Ошибочка. У бота не достаточно прав!');
		return;
	}

	if(msg.channel.type == 'dm' && !cmd.help.dm) {
		client.userLib.retError(msg.channel, {id: msg.author.id, tag: msg.author.tag, displayAvatarURL: msg.author.displayAvatarURL}, 'Команда не доступна для использования в ЛС.'); return;
	}

	if(cmd.help.tier && !client.userLib.checkPerm(cmd.help.tier, msg.guild.ownerID, msg.member)) {
		client.userLib.retError(msg.channel, {id: msg.author.id, tag: msg.author.tag, displayAvatarURL: msg.author.displayAvatarURL}, 'Не достаточно прав!'); return;
	}

	if(cmd.help.args && !args.length) {
		client.userLib.retError(msg.channel, {id: msg.author.id, tag: msg.author.tag, displayAvatarURL: msg.author.displayAvatarURL}, `Аргументы команды введены не верно!${cmd.help.usage ? `\nИспользование команды: \`\`${prefix}${cmd.help.name} ${cmd.help.usage}\`\`` : ''}`); return;
	}

	if (!client.userLib.admins.hasOwnProperty(msg.author.id)) {
		if (!client.userLib.cooldown.has(cmd.help.name)) {
			client.userLib.cooldown.set(cmd.help.name, new Map);
		}

		const now = Date.now();
		const times = client.userLib.cooldown.get(cmd.help.name);
		if (times.has(msg.author.id)) {
			let expirationTime = times.get(msg.author.id) + cmd.help.cooldown * 1000;
			if (now <= expirationTime) {
				let timeLeft = (expirationTime - now) / 1000;
				client.userLib.retError(msg.channel, {
					id: msg.author.id,
					tag: msg.author.tag,
					displayAvatarURL: msg.author.displayAvatarURL
				}, `Убери копыта от клавиатуры, пожалуйста.\nУспокойся, досчитай до \`\`${Math.round(timeLeft)}\`\` и попробуй снова!`);
				return;
			}
			// else {times.delete(msg.author.id)}
		}

		times.set(msg.author.id, now);
		setTimeout(() => { times.delete(msg.author.id); }, cmd.help.cooldown * 1000);
	}

	try {
		cmd.run(client, msg, args);
	} catch (err) {
		client.userLib.sendLog(`Ошибка!\nКоманда - ${cmd.help.name}\nСервер: ${msg.guild.name} (ID: ${msg.guild.id})\nКанал: ${msg.channel.name} (ID: ${msg.channel.id})\nПользователь: ${msg.author.tag} (ID: ${msg.author.id})\nТекст ошибки: ${err}`);
		client.userLib.retError(msg.channel, {id: msg.author.id, tag: msg.author.tag, displayAvatarURL: msg.author.displayAvatarURL}, 'Я не могу выполнить эту команду сейчас, но разработчики обязательно приступят к решению этой проблемы!');
	}

};

/* 
  tier
  -3 - Owner guild
  -2 - Admin guild
  -1 - Moderator guild
  0 - user
  1 - admin tier 0
  2 - admin tier 1

  help export

exports.help = {
	name: '',
	description: '',
	aliases: ['', ''],
	tier: 0,
	dm: 0,
	args: 0,
	usage: '',
	cooldown: 0
};

*/
