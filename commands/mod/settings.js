exports.help = {
	name: 'settings',
	description: 'Настройки бота',
};

exports.command = {
	name: exports.help.name,
	description: exports.help.description,
	options: [
		{
			name: 'badwords',
			description: 'Фильтр плохих слов в чате',
			type: 1,
			options: [
				{
					name: 'состояние',
					description: 'Состояние параметра',
					type: 5,
					required: true
				}
			]
		},
		{
			name: 'autocorrector',
			description: 'Проверка никнейма участнкиа при его заходе',
			type: 1,
			options: [
				{
					name: 'состояние',
					description: 'Состояние параметра',
					type: 5,
					required: true
				}
			]
		},
		{
			name: 'logchannel',
			description: 'Лог-канал',
			type: 1,
			options: [
				{
					name: 'канал',
					description: 'Канал для логов',
					type: 7,
					channel_types: [0]
				}
			]
		},
	]
};

const normalizeParametrs = {
	badwords: 'Фильтр плохих слов',
	autocorrector: 'Исправление никнеймов',
};

exports.run = async (client, interaction) => {
	switch (interaction.options.getSubcommand()) {
		case 'logchannel':
			if (!interaction.options.getChannel('канал'))
				client.userLib.sendLogChannel('commandUse', interaction.guild, {
					user: { tag: interaction.user.tag, id: interaction.user.id },
					channel: { id: interaction.channel.id },
					content: 'отключение лог-канала',
				});

			client.userLib.db.update(
				`guilds`,
				{ guildId: interaction.guildId, logchannel: interaction.options.getChannel('канал') ? interaction.options.getChannel('канал').id : null },
				() => {}
			);

			return client.userLib.retSuccess(interaction, !interaction.options.getChannel('канал') ? `**Лог канал отключен**!` : `${interaction.options.getChannel('канал')} **установлен как канал для логов!**`)
		default:
			if (!(await client.userLib.setSettings(interaction.guildId, interaction.options.getSubcommand(), interaction.options.getBoolean('состояние')))) return client.userLib.retError(interaction, 'Параметр уже находится в этом значении!');

			return client.userLib.retSuccess(interaction, `«\`${normalizeParametrs[interaction.options.getSubcommand()]}\`» - **${interaction.options.getBoolean('состояние') ? 'включен' : 'выключен'}**!`)
	}
};
