exports.help = {
	name: 'avatar',
	description: 'Ссылка на аватара пользователя',
	aliases: ['a'],
	usage: [{ type: 'user', opt: 1 }],
	dm: 1,
	tier: 0,
	cooldown: 1,
};

exports.run = (client, interaction) => {
	let user = new client.userLib.discord.User(
		client,
		interaction.data.hasOwnProperty('resolved')
			? Object.values(interaction.data.resolved.users)[0]
			: client.userLib.getUser(interaction).user
	);

	let embed = new client.userLib.discord.MessageEmbed()
		.setDescription(`Аватар ${user}`)
		.setColor(client.userLib.colors.inf)
		.setImage(user.displayAvatarURL({ dynamic: true, size: 2048 }))
		.setTimestamp();

	if (user.avatar && user.avatar.startsWith('a_')) embed.setFooter('GIF');

	client.userLib.replyInteraction(interaction, embed, !interaction.data.hasOwnProperty('resolved'));
};
