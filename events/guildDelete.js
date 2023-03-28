import logger from '../utils/logger.js';
import Guild from '../models/guild.js';

export default async function (guild) {
	if (!guild.available) return;

	await Guild.destroy({ where: { id: guild.id } });

	logger(
		`Cервер удалил бота. "${guild.name}", владелец "${guild.owner.user.tag}", всего там "${guild.memberCount}" участников.`,
		'core'
	);
}
