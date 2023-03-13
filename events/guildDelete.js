import logger from '../utils/logger.js';

export default function (guild) {
	if (!guild.available) return;
	//TODO: бдшка
	client.userLib.db.delete(`guilds`, { guildId: guild.id }, () => {});
	logger(
		`Cервер удалил бота. "${guild.name}", владелец "${guild.owner.user.tag}", всего там "${guild.memberCount}" участников.`,
		'guildDelete.js'
	);
}
