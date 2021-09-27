exports.help = {
	name: 'unmute',
	description: 'Снять мут с участника',
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
		}
	]
};

exports.run = async (client, interaction) => {
	let mutedRole = (
		await client.userLib.promise(
			client.userLib.db,
			client.userLib.db.queryValue,
			'SELECT mutedRole FROM guilds WHERE guildId = ?',
			[interaction.guildId]
		)
	).res;

	if (!interaction.guild.roles.cache.has(mutedRole)) return client.userLib.retError(interaction, 'Роли мута не существует.');

	await interaction.options.getMember('участник').roles.remove(mutedRole, 'Снятие мута!');
	client.userLib.db.delete('mutes', { userId: interaction.options.getUser('участник').id, guildId: interaction.guildId }, () => {});
	//TODO: Фиксануть отложенные таски, сейчас они не удаляются при unmute

	client.userLib.retSuccess(interaction, `${interaction.options.getUser('участник')} **был размьючен**!`)

	await client.userLib.sendLogChannel('commandUse', interaction.guild, {
		user: { tag: interaction.user.tag, id: interaction.user.id, avatar: interaction.user.displayAvatarURL() },
		channel: { id: interaction.channel.id },
		content: `снятие мута с ${interaction.options.getUser('участник')}`,
	});
};
