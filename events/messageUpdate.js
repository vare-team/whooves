import { ChannelType, PermissionFlagsBits } from 'discord.js';
import badWords from '../configs/badwords.js';
import { sendLogChannel } from '../services/guild-log.js';
import { checkSettings } from '../utils/settings-сontroller.js';
import mentionDetectRegexp from '../configs/mention-detect-regexp.js';
import autoWarn from '../services/auto-warn.js';

export default async function (oldMessage, newMessage) {
	if (oldMessage.author.bot || newMessage.author.bot) return;

	if (
		newMessage.channel.type !== ChannelType.DM &&
		!newMessage.member.permissions.has(PermissionFlagsBits.ManageMessages)
	) {
		const badWordsCheck = newMessage.content
			.toLowerCase()
			.replace(/[^a-zа-яЁё ]/g, '')
			.replace('ё', 'е')
			.trim()
			.split(/ +/g);

		if (
			(await checkSettings(newMessage.guild.id, 'chatAutoModeration')) &&
			badWords.some(w => badWordsCheck.includes(w))
		) {
			await autoWarn(newMessage.author, newMessage.guild, newMessage.channel, 'Ненормативная лексика');
			newMessage.delete();
		}
	}

	if (oldMessage.content === newMessage.content) return;

	await sendLogChannel('messageUpdate', oldMessage.guild, {
		user: { tag: oldMessage.author.tag, id: oldMessage.member.id, avatar: oldMessage.member.user.displayAvatarURL() },
		oldContent: oldMessage.cleanContent?.replace(mentionDetectRegexp, '**@**🏓') ?? 'Что-то',
		newContent: newMessage.cleanContent?.replace(mentionDetectRegexp, '**@**🏓') ?? 'Что-то',
		channel: { id: oldMessage.channel.id },
	});
}
