exports.help = {
	name: 'ban',
	description: 'Выдать бан участнику.',
	extraPermissions: ['BAN_MEMBERS'],
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
			description: 'Причина бана',
			type: 3,
		},
		{
			name: 'force',
			description: 'Игнорировать количество варнов',
			type: 5,
		},
		{
			name: 'clearmsg',
			description: 'Очистить сообщения участника',
			type: 5,
		},
	],
};

exports.run = async (client, interaction) => {
	if (!interaction.options.getMember('участник').bannable)
		return client.userLib.retError(
			interaction,
			'Я не могу забанить этого участника!\nЕго защитная магия превосходит мои умения!'
		);

	if (!interaction.options.getBoolean('force')) {
		const warns = await client.userLib.promise(client.userLib.db, client.userLib.db.count, 'warns', {
			userId: interaction.options.getUser('участник').id,
			guildId: interaction.guildId,
		});

		if (warns.res < 5)
			return client.userLib.retError(
				interaction,
				'Для выдачи бана необходимо **5** варнов!\nИспользуй аргумент `force` для бана.'
			);
	}

	const reason = interaction.options.getString('причина') || 'Причина не указана';

	await interaction.options
		.getUser('участник')
		.send(
			`Вам был выдан бан на сервере \`\`${interaction.guild.name}\`\`, модератором \`\`${interaction.user.tag}\`\`, по причине: ${reason}`
		)
		.catch(() =>
			client.userLib.sendLog(
				`${exports.help.name} : DM Send catch! Guild ${interaction.guild.name} (ID:${interaction.guildId}), @${
					interaction.options.getUser('участник').tag
				} (ID:${interaction.options.getUser('участник').id})`,
				'DM_SEND_ERROR'
			)
		);

	await interaction.guild.members.ban(interaction.options.getMember('участник'), {
		reason: `${interaction.user.tag}: ${reason}`,
		days: interaction.options.getBoolean('clearmsg') ? 7 : 0,
	});

	client.userLib.retSuccess(
		interaction,
		`${interaction.options.getMember('участник')} **был забанен!** ***||*** ${reason}`
	);
};
