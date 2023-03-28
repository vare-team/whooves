import { sendLogChannel } from '../services/guild-log.js';

/**
 *
 * @param messages {Collection<Snowflake, Message>}
 * @return {Promise<undefined|*>}
 */
export default async function (messages) {
	const first = messages.first();
	await sendLogChannel('messageDeleteBulk', first.guild, {
		user: {
			tag: 'NullPony#0000',
			id: '',
			avatar: first.client.user.defaultAvatarURL,
		},
		channel: { id: first.channel.id },
		size: messages.size,
	});
}
