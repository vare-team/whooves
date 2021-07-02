module.exports = (client, guild) => {
	if (!guild.available) return;
	client.userLib.db.delete(`guilds`, { guildId: guild.id }, () => {});
	client.userLib.sendLog(
		`Cервер удалил бота. "${guild.name}", владелец "${guild.owner.user.tag}", всего там "${guild.memberCount}" участников.`
	);
};
