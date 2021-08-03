exports.help = {
	name: 'avatar',
	description: 'Ссылка на аватара пользователя',
	dm: 1,
	tier: 0,
	cooldown: 1,
};

exports.command = {
	name: exports.help.name,
	description: exports.help.description,
	options: [
		{
			name: 'пользователь',
			description: 'пользователь',
			type: 6,
		},
	],
};

exports.run = (client, interaction) => {
	const user = interaction.options.getUser('пользователь') || interaction.user;

	let embed = new client.userLib.discord.MessageEmbed()
		.setDescription(`Аватар ${user}`)
		.setColor(client.userLib.colors.inf)
		.setImage(user.displayAvatarURL({ dynamic: true, size: 2048 }))
		.setTimestamp();

	if (user.avatar && user.avatar.startsWith('a_')) embed.setFooter('GIF');

	interaction.reply({ embeds: [embed], ephemeral: !interaction.options.getUser('пользователь') });
};
