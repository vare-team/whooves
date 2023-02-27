exports.help = {
	name: 'warn',
	description: 'Выдать предупреждение участнику',
	usage: [
		{ type: 'user', opt: 0 },
		{ type: 'text', opt: 1, name: 'причина' },
	],
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
			description: 'Причина выдачи предупреждения',
			type: 3,
		},
	],
};

exports.run = async (client, interaction) => {
	if (interaction.options.getString('причина') && interaction.options.getString('причина').length > 300)
		return client.userLib.retError(interaction, 'Причина не может содержать в себе более 300 символов!');

	const wUser = interaction.options.getUser('участник'),
		warn = await client.userLib.promise(client.userLib.db, client.userLib.db.insert, 'warns', {
			userId: wUser.id,
			guildId: interaction.guildId,
			who: interaction.user.id,
			reason: interaction.options.getString('причина'),
		}),
		warnInfo = await client.userLib.promise(
			client.userLib.db,
			client.userLib.db.queryValue,
			'SELECT COUNT(*) FROM warns WHERE userId = ? AND guildId = ?',
			[wUser.id, interaction.guildId]
		);

	const embed = new client.userLib.discord.MessageEmbed()
		.setColor(client.userLib.colors.war)
		.setTitle(`${wUser.tag} выдано предупреждение!`)
		.setDescription(
			`Причина: **${interaction.options.getString('причина') ?? 'Не указана'}**\nВсего предупреждений: **${
				warnInfo.res
			}**\nID предупреждения: **${warn.res}**`
		)
		.setTimestamp();

	interaction.reply({ embeds: [embed] });

	await client.userLib.sendLogChannel('commandUse', interaction.guild, {
		user: { tag: interaction.user.tag, id: interaction.user.id },
		channel: { id: interaction.channelId },
		content: `выдача предупреждения (ID: ${warn.res}) ${wUser.id} по причине: ${
			interaction.options.getString('причина') ?? 'Не указана'
		}`,
	});
};
