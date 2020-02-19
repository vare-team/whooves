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

	if(msg.channel.type != 'dm' && !msg.channel.memberPermissions(client.user).has('EMBED_LINKS')) {
		msg.reply('Хмм... Ошибочка. У бота не достаточно прав!');
		return;
	}

	if (msg.channel.type == 'dm' && !cmd.help.dm) {
		client.userLib.retError(msg.channel, {id: msg.author.id, tag: msg.author.tag, displayAvatarURL: msg.author.displayAvatarURL}, 'Команда не доступна для использования в ЛС.'); return;
	}

	if (cmd.help.tier && !client.userLib.checkPerm(cmd.help.tier, msg.channel.type == 'dm' ? msg.author.id : msg.guild.ownerID, msg.channel.type == 'dm' ? msg.author : msg.member)) {
		client.userLib.retError(msg.channel, {id: msg.author.id, tag: msg.author.tag, displayAvatarURL: msg.author.displayAvatarURL}, 'Не достаточно прав!'); return;
	}


	// USAGE PARSER
	if (cmd.help.usage) {
		if (cmd.help.usage.includes("[")) {
			cmd.help.args = true;
			cmd.help.argsCount = (cmd.help.usage.match(/\[/g) || []).length;
		}
		if (cmd.help.usage.includes('[@кто]')) cmd.help.userMention = true;
		if (cmd.help.usage.includes('[#текстовый_канал]')) cmd.help.channelMention = true;
		if (cmd.help.usage.includes('{подключение}')) cmd.help.inVoice = true;
	}
	// USAGE PARSE

	//Magic Mention
	let magicPosition = cmd.help.usage.split(/ +/g).findIndex(item => item.slice(1, -1) == '@кто');
	if (magicPosition != -1) {
		msg.magicMention = msg.mentions.users.first() ? msg.mentions.users.first() : args[magicPosition] ? msg.guild.members.get(args[0]) ? msg.guild.members.get(args[magicPosition]) : msg.guild.members.find(val => val.user.username.toLowerCase().startsWith(args[magicPosition].toLowerCase())) : false;
		msg.magicMention = msg.magicMention != null ? msg.magicMention.user ? msg.magicMention.user : msg.magicMention : false;
	}
	//Magic Mention

	//CHECK ARGS
	let tempError = '';
	if (cmd.help.args && !args.length)
		tempError = 'Аргументы команды введены не верно!';
	if (!tempError && cmd.help.args && cmd.help.argsCount > args.length)
		tempError = 'Количество аргументов не верно!';
	if (!tempError && cmd.help.userMention && !msg.magicMention)
		tempError = 'Введённая вами команда требует упоминания.';
	if (!tempError && cmd.help.userMention && msg.magicMention.id == msg.author.id)
		tempError = 'Само~~удволетворение~~упоминание никогда к хорошему не приводило.';
	if (!tempError && cmd.help.channelMention && !msg.mentions.channels.first())
		tempError = 'Нужно указать канал.';
	if (!tempError && cmd.help.inVoice && !msg.member.voiceChannel)
		tempError = 'Вы должны находиться в голосовом канале!';

	if (tempError) {
		client.userLib.retError(msg.channel, msg.author, `${tempError}\nИспользование команды: \`\`${prefix}${cmd.help.name} ${cmd.help.usage}\`\``);
		// msg.react('❌');
		return;
	}
	//CHECK ARGS


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
				client.userLib.sendLog(`Try use: ${command}, Time left: ${timeLeft}, By: @${msg.author.tag}(${msg.author.id}), In: ${msg.guild.name}(${msg.guild.id}) => #${msg.channel.name}(${msg.channel.id})`, 'Info');
				return;
			}
		}

		times.set(msg.author.id, now);

		client.userLib.sc.pushTask({code: 'unCooldown', time: cmd.help.cooldown * 1000, params: [times, msg.author.id]});
	}

	try {
		cmd.run(client, msg, args);
		client.userLib.sendLog(`Use: ${command}, By: @${msg.author.tag}(${msg.author.id}), In: ${msg.channel.type == 'dm' ? 'DM' : `${msg.guild.name}(${msg.guild.id}) => #${msg.channel.name}(${msg.channel.id})`}`, 'Info');
		client.statistic.executedcmd++;
	} catch (err) {
		client.userLib.sendLog(`! Ошибка!\n! Команда - ${cmd.help.name}\n! ${msg.channel.type == 'dm' ? 'DM' : `Сервер: ${msg.guild.name} (ID: ${msg.guild.id})\\n! Канал: ${msg.channel.name} (ID: ${msg.channel.id})\\n!`} Пользователь: ${msg.author.tag} (ID: ${msg.author.id})\n! Текст ошибки: ${err}`, 'ERROR!');
		client.userLib.retError(msg.channel, {id: msg.author.id, tag: msg.author.tag, displayAvatarURL: msg.author.displayAvatarURL}, 'Я не могу выполнить эту команду сейчас, но разработчики обязательно приступят к решению этой проблемы!');
		client.statistic.erroredcmd++;
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
