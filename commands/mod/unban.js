exports.help = {
	name: 'unban',
	description: 'Разбанить участника',
	extraPermissions: ['BAN_MEMBERS'],
};

exports.command = {
	name: exports.help.name,
	description: exports.help.description,
	options: [
		{
			name: 'id',
			description: 'ID пользователя',
			type: 3,
			required: true
		}
	]
};

exports.run = async (client, interaction) => {
	const user = await client.users.fetch(interaction.options.getString('id')).catch(() => {}) || undefined;
	const ban = await interaction.guild.bans.fetch({ user, force: true }).catch(() => {}) || undefined;

	if (user === undefined) return client.userLib.retError(interaction, 'Пользователь не найден!');
	if (ban === undefined) return client.userLib.retError(interaction, 'Пользователь не забанен!');

	await interaction.guild.members.unban(user).catch(() => {});

	client.userLib.retSuccess(interaction, `\`${user.tag}\` **был разбанен!**`);
};
