import { sendLogChannel } from '../utils/modules/guildLog.js';

export default async function (message) {
	if (message.author.bot) return;

	return sendLogChannel('messageDelete', message.guild, {
		user: { tag: message.author.tag, id: message.author.id, avatar: message.author.displayAvatarURL() },
		channel: { id: message.channel.id },
		content: message.cleanContent ? message.cleanContent.replace(client.userLib.mentionDetect, '**@**🏓') : 'Что-то',
	});
}
