import { sendLogChannel } from '../services/guild-log.js';
import mentionDetectRegexp from '../configs/mention-detect-regexp.js';

export default async function (message) {
	if (message.author.bot) return;

	await sendLogChannel('messageDelete', message.guild, {
		user: { tag: message.author.tag, id: message.author.id, avatar: message.author.displayAvatarURL() },
		channel: { id: message.channel.id },
		content: message.cleanContent?.replace(mentionDetectRegexp, '**@**🏓') ?? 'Что-то',
	});
}
