exports.help = {
	name: 'avatar',
	description: 'Ссылка на аватара пользователя',
	aliases: ['a'],
	usage: [{ type: 'user', opt: 1 }],
	dm: 1,
	tier: 0,
	cooldown: 1,
};

exports.run = (client, msg) => {
	let user = msg.magicMention.user || msg.author;

	let embed = new client.userLib.discord.MessageEmbed()
		.setDescription(`Аватар ${user}`)
		.setColor(client.userLib.colors.inf)
		.setImage(user.displayAvatarURL({ dynamic: true, size: 2048 }))
		.setTimestamp();
	if (user.avatar && user.avatar.startsWith('a_')) embed.setFooter('GIF');
	msg.channel.send(embed);
};
