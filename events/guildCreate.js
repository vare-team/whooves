import logger from '../utils/logger.js';

export default async function (guild) {
	const owner = await guild.fetchOwner();
	logger(
		`Новый сервер "${guild.name}", владелец "${owner.user.tag}", всего там "${guild.memberCount}" участников.`,
		'core'
	);
}
