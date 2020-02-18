exports.help = {
	name: "unban",
	description: "Разбанить учасника.",
	aliases: [],
	usage: "[ID_кто] (причина)",
	dm: 0,
	tier: -1,
	cooldown: 5
};

exports.run = async (client, msg, args) => {
	let reason = args.slice(1).join(' ') ? args.slice(1).join(' ') : 'Причина не указана';

	msg.guild.unban(args[0], msg.author.tag + ': ' + reason);
};