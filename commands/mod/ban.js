exports.help = {
	name: "ban",
	description: "Выдать бан участнику.",
	aliases: [],
	usage: "[@кто] (причина) (-force,-clearmsg)",
	dm: 0,
	tier: -1,
	cooldown: 5
};

exports.run = async (client, msg, args) => {
	if (!msg.guild.members.get(msg.magicMention.id).bannable) {
		client.userLib.retError(msg.channel, msg.author, 'Я не могу забанить этого участника!\nЕго защитная магия превосходит мои умения!');
		return;
	}

	let arguments = {};

	arguments.force = args.indexOf('-force');
	if (arguments.force != -1) args.splice(arguments.force, 1);

	arguments.clearmsg = args.indexOf('-clearmsg');
	if (arguments.clearmsg != -1) args.splice(arguments.clearmsg, 1);

	let reason = args.slice(1).join(' ') ? args.slice(1).join(' ') : 'Причина не указана';

	if (arguments.force != -1 && !client.userLib.checkPerm(-2, msg.guild.ownerID, msg.member)) {
		client.userLib.retError(msg.channel, msg.author, 'Аргумент \`\`-force\`\` доступен только администраторам!');
		return;
	}

	let warns = await client.userLib.promise(client.userLib.db, client.userLib.db.query, 'SELECT * FROM warns WHERE userId = ? AND guildId = ?', [msg.magicMention.id, msg.guild.id]);
	warns = warns.res.length;

	if (warns < 4 && arguments.force == -1) {
		client.userLib.retError(msg.channel, msg.author, 'Для выдачи бана необходимо 5 варнов!\nИспользуй аргумент \`\`-force\`\` для бана.');
		return;
	}

	await msg.magicMention.send(`Вам был выдан бан на сервере \`\`${msg.guild.name}\`\`, модератором \`\`${msg.author.tag}\`\`, по причине: ${reason}`);
	msg.guild.ban(msg.magicMention, {reason: msg.author.tag + ': ' + reason, days: arguments.clearmsg != -1 ? 7 : 0});

	let embed = new client.userLib.discord.RichEmbed().setColor(client.userLib.colors.suc).setDescription(`Бан ${msg.magicMention} выдан!\nПричина: ${reason}`).setTimestamp().setFooter(msg.author.tag, msg.author.avatarURL);
	msg.channel.send(embed);
};