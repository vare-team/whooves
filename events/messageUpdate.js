import { ChannelType } from 'discord.js';
import badWords from '../models/badwords.js';
import { sendLogChannel } from '../utils/modules/guildLog.js';
import { checkSettings } from '../utils/modules/settingsController.js';

export default async function (oldMessage, newMessage) {
	if (oldMessage.author.bot || newMessage.author.bot) return;

	if (
		newMessage.channel.type !== ChannelType.DM &&
		!client.userLib.checkPerm(-1, { ownerID: newMessage.guild.ownerID, member: newMessage.member })
	) {
		if (
			(await checkSettings(newMessage.guild.id, 'badwords')) &&
			badWords.some(w =>
				newMessage.content
					.toLowerCase()
					.replace(/[^a-zа-яЁё ]/g, '')
					.replace('ё', 'е')
					.trim()
					.split(/ +/g)
					.includes(w)
			)
		) {
			client.userLib.autowarn(newMessage.author, newMessage.guild, newMessage.channel, 'Ненормативная лексика');
			newMessage.delete();
		}
	}

	if (newMessage.content.endsWith('w.l')) {
		client.commands.get('lang').run(client, newMessage, oldMessage.content.trim().split(/ +/g));
	}

	if (oldMessage.content === newMessage.content) return;

	await sendLogChannel('messageUpdate', oldMessage.guild, {
		user: { tag: oldMessage.author.tag, id: oldMessage.member.id, avatar: oldMessage.member.user.displayAvatarURL() },
		oldContent: oldMessage.cleanContent
			? oldMessage.cleanContent.replace(client.userLib.mentionDetect, '**@**🏓')
			: 'Что-то',
		newContent: newMessage.cleanContent
			? newMessage.cleanContent.replace(client.userLib.mentionDetect, '**@**🏓')
			: 'Что-то',
		channel: { id: oldMessage.channel.id },
	});
}
