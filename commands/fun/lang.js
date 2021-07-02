exports.help = {
	name: 'lang',
	description: 'Перевести текст в русскую раскладку.',
	aliases: ['l'],
	usage: [{ type: 'text', opt: 0, name: 'текст' }],
	dm: 1,
	tier: 0,
	cooldown: 5,
};

exports.run = (client, msg, args) => {
	let embed = new client.userLib.discord.MessageEmbed()
		.setColor(client.userLib.colors.suc)
		.setDescription(client.userLib.translate(args.join(' ')))
		.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
		.setFooter('Исправление раскладки текста');

	msg.channel.send(embed);
	msg.delete();
};
