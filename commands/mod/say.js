exports.help = {
	name: 'say',
	description: 'Написать от имени бота.',
	aliases: ['s'],
	usage: [{ type: 'text', opt: 0, name: 'текст' }],
	dm: 0,
	tier: -2,
	cooldown: 5,
};

exports.run = (client, msg, args) => {
	let embed = new client.userLib.discord.MessageEmbed()
		.setColor(client.userLib.colors.inf)
		.setDescription(args.join(' '));
	msg.channel.send(embed);
	msg.delete();
};
