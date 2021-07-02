exports.help = {
	name: 'unban',
	description: 'Разбанить учасника.',
	aliases: ['ubn'],
	usage: [
		{ type: 'text', opt: 0, name: 'ID кто' },
		{ type: 'text', opt: 1, name: 'причина' },
	],
	dm: 0,
	tier: -1,
	cooldown: 5,
};

exports.run = async (client, msg, args) => {
	let reason = args.slice(1).join(' ') || 'Причина не указана';

	msg.guild.members.unban(args[0], msg.author.tag + ': ' + reason).catch(() => {});

	let embed = new client.userLib.discord.MessageEmbed()
		.setColor(client.userLib.colors.suc)
		.setDescription(`Бан ${args[0]} снят!\nПричина: ${reason}`)
		.setTimestamp()
		.setFooter(msg.author.tag, msg.author.displayAvatarURL());
	msg.channel.send(embed);
};
