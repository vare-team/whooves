import { sendLogChannel } from '../utils/modules/guildLog.js';

export default function (member) {
	return sendLogChannel('memberRemove', member.guild, {
		user: { tag: member.user.tag, id: member.id, avatar: member.user.displayAvatarURL(), joinedAt: member.joinedAt },
	});
}
