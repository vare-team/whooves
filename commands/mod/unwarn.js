exports.help = {
	name: 'unwarn',
	description: 'Снять предупреждение с участника',
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
			name: 'id',
			description: 'ID Предупреждения',
			type: 4,
			required: true,
		},
	],
};

exports.run = async (client, interaction) => {
	if (!interaction.options.getUser('участник').id || !interaction.options.getInteger('id')) return;

	const warn = await client.userLib.promise(client.userLib.db, client.userLib.db.delete,
		'warns',
		{
			userId: interaction.options.getUser('участник').id,
			guildId: interaction.guildId,
			warnId: interaction.options.getInteger('id')
		}
	);

	if (!warn.res) return client.userLib.retError(interaction, 'Тщательно проверив свои записи, я не нашёл предупреждения с такими данными.');

	if (warn.res > 1) client.userLib.sendLog('Удаление варнов сломалось!');

	client.userLib.retSuccess(interaction, `С ${interaction.options.getUser('участник')} **снято предупреждение**.`);

	await client.userLib.sendLogChannel('commandUse', interaction.guild, {
		user: { tag: interaction.user.tag, id: interaction.user.id},
		channel: { id: interaction.channelId },
		content: `снятие предупреждения (ID:${interaction.options.getInteger('id')}) с ${interaction.options.getUser('участник').id}`,
	});
};
