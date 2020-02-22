exports.help = {
	name: "ban",
	description: "Выдать бан участнику.",
	aliases: ['bn'],
	usage: [{type: 'user', opt: 0},
					{type: 'text', opt: 1, name: 'причина'},
					{type: 'text', opt: 1, name: '-force'},
					{type: 'text', opt: 1, name: '-clearmsg'}],
	dm: 0,
	tier: -1,
	cooldown: 5
};

exports.run = async (client, msg, args) => {
	if (msg.magicMention.bannable) {
		client.userLib.retError(msg, 'Я не могу забанить этого участника!\nЕго защитная магия превосходит мои умения!');
		return;
	}

	let force = args.indexOf('-force');
	if (force != -1) args.splice(force, 1);

	if (force != -1 && !client.userLib.checkPerm(-2, {ownerID: msg.guild.ownerID, member: msg.member})) {
		client.userLib.retError(msg, 'Аргумент \`\`-force\`\` доступен только администраторам!');
		return;
	}

	let warns = await client.userLib.promise(client.userLib.db, client.userLib.db.count, 'warns', {userId: msg.magicMention.id, guildId: msg.guild.id});
	warns = warns.res;

	if (warns < 5 && force == -1) {
		client.userLib.retError(msg, 'Для выдачи бана необходимо 5 варнов!\nИспользуй аргумент \`\`-force\`\` для бана.');
		return;
	}

	let clearmsg = args.indexOf('-clearmsg');
	if (clearmsg != -1) {args.splice(clearmsg, 1);clearmsg = 7;} else clearmsg = 0;

	let reason = args.slice(1).join(' ') || 'Причина не указана';

	await msg.magicMention.user.send(`Вам был выдан бан на сервере \`\`${msg.guild.name}\`\`, модератором \`\`${msg.author.tag}\`\`, по причине: ${reason}`);
	msg.guild.ban(msg.magicMention, {reason: msg.author.tag + ': ' + reason, days: clearmsg});

	let embed = new client.userLib.discord.RichEmbed().setColor(client.userLib.colors.suc).setDescription(`Бан ${msg.magicMention} выдан!\nПричина: ${reason}`).setTimestamp().setFooter(msg.author.tag, msg.author.avatarURL);
	msg.channel.send(embed);
};