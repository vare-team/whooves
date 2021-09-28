exports.help = {
	name: 'kick',
	description: 'Кикнуть участника.',
	extraPermissions: ['KICK_MEMBERS']
};

exports.command = {
	name: exports.help.name,
	description: exports.help.description,
	options: [
		{
			name: 'участник',
			description: 'Участник сервера',
			type: 6,
			required: true,
		},
		{
			name: 'причина',
			description: 'Причина исключения',
			type: 3,
		}
	]
};

exports.run = async (client, interaction) => {
	if (!interaction.options.getMember('участник').kickable) return client.userLib.retError(interaction, 'Я не могу кикнуть этого участника!\nЕго защитная магия превосходит мои умения!');

	const reason = interaction.options.getString('причина') || 'Причина не указана';

	// await interaction.options.getUser('участник').send(
	// 	`Вы были кикнуты с сервера \`\`${interaction.guild.name}\`\`, модератором \`\`${interaction.user.tag}\`\`, по причине: ${reason}`
	// );
	//TODO: Сделать проверку на возможность отправки сообщения в лс

	await interaction.options.getMember('участник').kick(interaction.user.tag + ": " + reason);

	client.userLib.retSuccess(interaction, `${interaction.options.getMember('участник')} **был кикнут!** ***||*** ${reason}`);
};
