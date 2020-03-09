exports.help = {
	name: "kick",
	description: "Кикнуть участника.",
	aliases: ['kc'],
	usage: [{type: 'user', opt: 0},
					{type: 'text', opt: 1, name: 'причина'},
					{type: 'text', opt: 1, name: '-force'}],
	dm: 0,
	tier: -1,
	cooldown: 5
};

exports.run = async (client, msg, args) => {
	if (!msg.magicMention.kickable) {
		client.userLib.retError(msg, 'Я не могу кикнуть этого участника!\nЕго защитная магия превосходит мои умения!');
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

	if (warns < 3 && force == -1) {
		client.userLib.retError(msg, 'Для выдачи кика необходимо 3 варнов!\nИспользуй аргумент \`\`-force\`\` для кика.');
		return;
	}

	let reason = args.slice(1).join(' ') || 'Причина не указана';

	await msg.magicMention.user.send(`Вы были кикнуты с сервера \`\`${msg.guild.name}\`\`, модератором \`\`${msg.author.tag}\`\`, по причине: ${reason}`);
	msg.magicMention.kick(reason);

	let embed = new client.userLib.discord.MessageEmbed().setColor(client.userLib.colors.suc).setDescription(`${msg.magicMention} был кикнут!\nПричина: ${reason}`).setTimestamp().setFooter(msg.author.tag, msg.author.displayAvatarURL());
	msg.channel.send(embed);
};