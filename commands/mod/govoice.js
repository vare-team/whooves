exports.help = {
	name: 'govoice',
	description: 'Переместить всех в вашем голосовом канале в указанный канал.',
	extraPermissions: ['MOVE_MEMBERS']
};

exports.command = {
	name: exports.help.name,
	description: exports.help.description,
	options: [
		{
			name: 'куда',
			description: 'Голосовой канал, в который будут перемещены участники',
			type: 7,
			required: true,
			channel_types: [2]
		},
		{
			name: 'откуда',
			description: 'Голосовой канал, из которого будут перемещены участники',
			type: 7,
			channel_types: [2]
		}
	]
};

exports.run = async (client, interaction) => {
	const newChannel = interaction.options.getChannel('куда'),
		  oldChannel = interaction.options.getChannel('откуда') || interaction.member.voice.channel || null;

	if (!oldChannel) return client.userLib.retError(interaction, 'Вы должны находиться в голосовом канале или указать его в аргументе!');
	if (oldChannel.id === newChannel.id) return client.userLib.retError(interaction, 'Новый канал совпадает со старым!');
	if (!oldChannel.viewable || !newChannel.viewable) return client.userLib.retError(interaction, 'У меня не хватает прав для взаимодействия с этими каналами!');
	if (oldChannel.members.size === 0) return client.userLib.retError(interaction, 'В указанном канале пусто!');

	await oldChannel.fetch();
	await newChannel.fetch();

	if (!oldChannel.manageable || !newChannel.manageable) return client.userLib.retError(interaction, 'Вы должны находиться в голосовом канале или указать его в аргументе!');

	await interaction.deferReply();

	for (let member of oldChannel.members) {
		await member[1].voice.setChannel(newChannel);
	}

	client.userLib.retSuccess(interaction, `${oldChannel} **был перемещён в** ${newChannel}`);
};
