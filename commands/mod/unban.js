exports.help = {
	name: "unban",
	description: "Разбанить учасника.",
	aliases: ['ubn'],
	usage: "[ID_кто] (причина)",
	dm: 0,
	tier: -1,
	cooldown: 5
};

exports.run = async (client, msg, args) => {
	let reason = args.slice(1).join(' ') ? args.slice(1).join(' ') : 'Причина не указана';

	msg.guild.unban(args[0], msg.author.tag + ': ' + reason);

	let embed = new client.userLib.discord.RichEmbed().setColor(client.userLib.colors.suc).setDescription(`Бан ${args[0]} снят!\nПричина: ${reason}`).setTimestamp().setFooter(msg.author.tag, msg.author.avatarURL);
	msg.channel.send(embed);
};