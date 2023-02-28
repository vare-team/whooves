module.exports = async (client, member) => {
	if (
		(await client.userLib.checkSettings(member.guild.id, 'usernamechecker')) &&
		member.manageable &&
		!client.userLib.isUsernameCorrect(member.displayName)
	) {
		const correctName = client.userLib.getUsernameCorrect(member.displayName);
		member.send(
			`На сервере "**${member.guild.name}**" ваше имя "**${member.displayName}**" было изменено на **${correctName}**, в связи с запретом на не стандартные символы.\nДля его изменения обратитесь к администрации сервера.`
		);
		member.edit({ nick: correctName });
	}

	client.userLib.sendLogChannel('memberAdd', member.guild, {
		user: {
			tag: member.user.tag,
			id: member.id,
			createdAt: member.user.createdAt,
			avatar: member.user.displayAvatarURL(),
		},
	});
};
