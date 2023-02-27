exports.help = {
	name: 'clearmsg',
	description: 'Очистить сообщения',
};

exports.command = {
	name: exports.help.name,
	description: exports.help.description,
	options: [
		{
			name: 'количество',
			description: 'Количество сообщений (не более 100 за раз)',
			type: 4,
			required: true,
		},
		{
			name: 'участник',
			description: 'Удалить только сообщения от участника',
			type: 6,
		},
	],
};

exports.run = async (client, interaction) => {
	if (interaction.options.getInteger('количество') > 99 || interaction.options.getInteger('количество') < 1)
		return client.userLib.retError(interaction, 'Число должно быть не более 100 и не менее 1!');

	const dmsg = await interaction.channel.bulkDelete(interaction.options.getInteger('количество'), true);

	const embed = new client.userLib.discord.MessageEmbed()
		.setColor(client.userLib.colors.suc)
		.setTitle('Удаление сообщений')
		.setDescription(`Сообщения были удалены (**${dmsg.size}**)!`)
		.setTimestamp();

	msg.channel.send(embed).then(msgs => msgs.delete({ timeout: 10000 }));
};
