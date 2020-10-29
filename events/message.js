module.exports = async (client, msg) => {
	if (msg.author.bot) return;

	msg.badWordsCheck = msg.content.toLowerCase().replace(/[^a-zа-яЁё ]/g,'').replace('ё','е').trim().split(/ +/g);
	if (msg.channel.type !== 'dm' && await client.userLib.checkSettings(msg.guild.id, 'badwords') && client.userLib.badWords.some(w => msg.badWordsCheck.includes(w))) {
		client.userLib.autowarn(msg.author, msg.guild, msg.channel, 'Ненормативная лексика');
		msg.delete();
	}

	msg.flags = {};

	let prefix = msg.channel.type == 'dm' ? 'w.' : (await client.userLib.promise(client.userLib.db, client.userLib.db.queryValue, 'SELECT prefix FROM guilds WHERE guildId = ?', [msg.guild.id])).res || 'w.';
	msg.flags.prefix = prefix;

	if (msg.content === `<@!${client.user.id}>`) {
		msg.reply(`Мой префикс \`\`${prefix}\`\`\nМожешь написать \`\`${prefix}help\`\` для помощи.`);
		return;
	}

	if (!msg.content.toLowerCase().startsWith(prefix)) {
		client.userLib.db.query('INSERT INTO users (userId, tag) VALUES (?, ?) ON DUPLICATE KEY UPDATE xp = xp + ?', [
			msg.author.id,
			msg.author.tag,
			client.userLib.randomIntInc(1, 5)]);
		return;
	}

	const [command, ...args] = msg.content.slice(prefix.length).trim().split(/ +/g);
	const cmd = client.commands.get(command.toLowerCase()) || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(command.toLowerCase()));
	if (!cmd) return;

	if (msg.channel.type != 'dm' && !msg.channel.permissionsFor(msg.guild.me).has('EMBED_LINKS')) {
		msg.reply('Хмм... Ошибочка. У бота недостаточно прав!');
		return;
	}

	if (msg.channel.type == 'dm' && !cmd.help.dm) {
		client.userLib.retError(msg, 'Команда не доступна для использования в ЛС.');
		return;
	}

	if (cmd.help.tier && !client.userLib.checkPerm(cmd.help.tier,
		msg.channel.type === 'dm' ? {ownerID: msg.author.id, member: msg.author}
			: {ownerID: msg.guild.ownerID, member: msg.member})) {
		client.userLib.retError(msg, 'Недостаточно прав!');
		return;
	}


	// USAGE PARSER
	if (cmd.help.usage.length) {
		cmd.help.argsCount = 0;
		cmd.help.usageStr = client.userLib.generateUsage(cmd.help.usage);
		for (let us of cmd.help.usage) {
			if (us.opt === 0) {
				cmd.help.argsCount++;
				if (!cmd.help.args) cmd.help.args = true;
				if (us.type === 'user') cmd.help.userMention = true;
				if (us.type === 'channel') cmd.help.channelMention = true;
				if (us.type === 'attach') cmd.help.hasAttach = true;
			}
			if (us.type === 'voice') cmd.help.hasVoice = true;
			if (us.type === 'user') cmd.help.userMentionPosition = cmd.help.usage.findIndex(el => us === el);
		}
	}
	// USAGE PARSE

	//Magic Mention
	if (cmd.help.userMentionPosition !== undefined && args[cmd.help.userMentionPosition] && cmd.help.userMentionPosition != -1) {
		msg.magicMention = msg.mentions.members.first()
			|| msg.guild.members.cache.get(args[cmd.help.userMentionPosition])
			|| msg.guild.members.cache.find(val => val.displayName.toLowerCase().startsWith(args[cmd.help.userMentionPosition].toLowerCase()))
			|| msg.guild.members.cache.find(val => val.user.username.toLowerCase().startsWith(args[cmd.help.userMentionPosition].toLowerCase()))
			|| false;
	} else {
		msg.magicMention = 0;
	}
	//Magic Mention

	//CHECK ARGS
	let tempError = '';
	if (cmd.help.args && !args.length)
		tempError += 'Аргументы команды введены не верно!\n';
	if (cmd.help.args && cmd.help.argsCount > args.length)
		tempError += 'Количество аргументов не верно!\n';
	if (cmd.help.userMention && !msg.magicMention)
		tempError += 'Введённая вами команда требует упоминания.\n';
	if (cmd.help.userMention && msg.magicMention
		&& msg.magicMention.id == msg.author.id
		&& msg.guild.ownerID !== msg.member.id)
		tempError += 'Само~~удволетворение~~упоминание никогда к хорошему не приводило.\n';
	if (cmd.help.channelMention && !msg.mentions.channels.first())
		tempError += 'Нужно указать канал.\n';
	if (cmd.help.hasVoice && !msg.member.voice.channel)
		tempError += 'Вы должны находиться в голосовом канале!\n';
	if (cmd.help.hasAttach && !msg.attachments.size)
		tempError += 'Вы должны прикрепить файл!\n';

	if (tempError) {
		client.userLib.retError(msg, `${tempError}\nИспользование команды: \`\`${prefix}${cmd.help.name} ${cmd.help.usageStr}\`\``);
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
				client.userLib.retError(msg, `Убери копыта от клавиатуры, пожалуйста.\nУспокойся, досчитай до \`\`${Math.round(timeLeft)}\`\` и попробуй снова!`);
				client.userLib.sendLog(`Try use: ${command}, Time left: ${timeLeft}, By: @${msg.author.tag}(${msg.author.id}), In: ${msg.guild.name}(${msg.guild.id}) => #${msg.channel.name}(${msg.channel.id})`, 'Info');
				return;
			}
		}

		times.set(msg.author.id, now);

		client.userLib.sc.pushTask({code: 'unCooldown', time: cmd.help.cooldown * 1000, params: [times, msg.author.id]});
	}

	try {
		cmd.run(client, msg, args);
		client.userLib.sendLog(client.userLib.generateUseLog(msg.channel.type, cmd.help.name, msg), 'Info');
		client.statistic.executedcmd++;
	} catch (err) {
		client.userLib.sendLog(client.userLib.generateErrLog(msg.channel.type, cmd.help.name, msg, err), 'ERROR!');
		client.userLib.retError(msg, 'Я не могу выполнить эту команду сейчас, но разработчики обязательно приступят к решению этой проблемы!');
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

let usage = [
	{type: 'text', opt: 0, name: ''},
	{type: 'text', opt: 1, name: ''},
	{type: 'user', opt: 0},
	{type: 'channel', opt: 1},
	{type: 'voice'},
	{type: 'attach', opt: 1}
];

*/
