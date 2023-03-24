import logger from '../utils/logger.js';

export default function (guild) {
	logger(
		`Новый сервер "${guild.name}", владелец "${guild.owner.user.tag}", всего там "${guild.memberCount}" участников.`,
		'core'
	);
}
