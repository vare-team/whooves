import { sendLogChannel } from '../services/guild-log.js';

export default async function (member) {
	await sendLogChannel('memberRemove', member.guild, {
		user: { tag: member.user.tag, id: member.id, avatar: member.user.displayAvatarURL(), joinedAt: member.joinedAt },
	});
}
