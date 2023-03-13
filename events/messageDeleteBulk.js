import { sendLogChannel } from '../utils/modules/guildLog.js';

/**
 *
 * @param messages {Collection<Snowflake, Message>}
 * @return {Promise<undefined|*>}
 */
export default function (messages) {
	const first = messages.first();
	return sendLogChannel('messageDeleteBulk', first.guild, {
		user: {
			tag: 'NullPony#0000',
			id: '',
			avatar: first.client.user.defaultAvatarURL,
		},
		channel: { id: first.channel.id },
		size: messages.size,
	});
}
