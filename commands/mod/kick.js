exports.help = {
	name: "kick",
	description: "Кикнуть участника.",
	aliases: ['kc'],
	usage: "[@кто] (причина) (-force)",
	dm: 0,
	tier: -1,
	cooldown: 5
};

exports.run = async (client, msg, args) => {
	if (!msg.guild.members.get(msg.magicMention.id).kickable) {
		client.userLib.retError(msg.channel, msg.author, 'Я не могу кикнуть этого участника!\nЕго защитная магия превосходит мои умения!');
		return;
	}

	let arguments = {};

	arguments.force = args.indexOf('-force');
	if (arguments.force != -1) args.splice(arguments.force, 1);

	console.log(args);

	let reason = args.slice(1).join(' ') ? args.slice(1).join(' ') : 'Причина не указана';

	if (arguments.force != -1 && !client.userLib.checkPerm(-2, msg.guild.ownerID, msg.member)) {
		client.userLib.retError(msg.channel, msg.author, 'Аргумент \`\`-force\`\` доступен только администраторам!');
		return;
	}

	let warns = await client.userLib.promise(client.userLib.db, client.userLib.db.query, 'SELECT * FROM warns WHERE userId = ? AND guildId = ?', [msg.magicMention.id, msg.guild.id]);
	warns = warns.res.length;

	if (warns < 2 && arguments.force == -1) {
		client.userLib.retError(msg.channel, msg.author, 'Для выдачи кика необходимо 3 варнов!\nИспользуй аргумент \`\`-force\`\` для кика.');
		return;
	}

	await msg.magicMention.send(`Вы были кикнуты с сервера \`\`${msg.guild.name}\`\`, модератором \`\`${msg.author.tag}\`\`, по причине: ${reason}`);
	msg.guild.members.get(msg.magicMention.id).kick(reason);

	let embed = new client.userLib.discord.RichEmbed().setColor(client.userLib.colors.suc).setDescription(`${msg.magicMention} был кикнут!\nПричина: ${reason}`).setTimestamp().setFooter(msg.author.tag, msg.author.avatarURL);
	msg.channel.send(embed);
};