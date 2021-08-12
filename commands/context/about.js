exports.help = {
	name: 'Информация',
	description: 'Общая информация о авторе сообщения.',
};

exports.command = {
	name: exports.help.name,
	type: 2,
};

exports.run = async (client, interaction) => {
	let embed = new client.userLib.discord.MessageEmbed().setColor(client.userLib.colors.inf).setTimestamp();
	embed
		.setTitle(interaction.options._hoistedOptions[0].member.bot ? 'Бот' : 'Пользователь')
		.setAuthor(
			interaction.options._hoistedOptions[0].user.tag,
			interaction.options._hoistedOptions[0].user.displayAvatarURL({ dynamic: true })
		)
		.addField(
			'Дата регистрации:',
			`<t:${Math.floor(interaction.options._hoistedOptions[0].user.createdAt / 1000)}:R>`,
			true
		)
		.setThumbnail(interaction.options._hoistedOptions[0].user.displayAvatarURL({ dynamic: true }))
		.addField(
			'Дата присоединения к этой гильдии:',
			`<t:${Math.floor(interaction.options._hoistedOptions[0].member.joinedTimestamp / 1000)}:R>`,
			true
		);
	if (interaction.options._hoistedOptions[0].user.flags.bitfield)
		embed.addField('Значки:', '```' + interaction.options._hoistedOptions[0].user.flags.toArray() + '```');

	interaction.reply({ embeds: [embed], ephemeral: true });
};
