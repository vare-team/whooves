import badWords from '../configs/badwords.js';
import { ChannelType, PermissionFlagsBits } from 'discord.js';
import randomIntInc from '../utils/random-int-inc.js';
import { checkSettings } from '../utils/settings-сontroller.js';
import User from '../models/user.js';
import autoWarn from '../services/auto-warn.js';

export default async function (message) {
	if (message.author.bot) return;

	if (message.channel.type !== ChannelType.DM && !message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
		const badWordsCheck = message.content
			.toLowerCase()
			.replace(/[^a-zа-яЁё ]/g, '')
			.replace('ё', 'е')
			.trim()
			.split(/ +/g);
		if (
			(await checkSettings(message.guild.id, 'chatAutoModeration')) &&
			badWords.some(w => badWordsCheck.includes(w))
		) {
			await autoWarn(message.author, message.guild, message.channel, 'Ненормативная лексика');
			message.delete();
		}
	}

	const [user] = await User.findOrCreate({ where: { id: message.author.id } });
	await user.increment({ xp: randomIntInc(1, 5) });
}
