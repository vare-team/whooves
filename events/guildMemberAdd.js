import { sendLogChannel } from '../services/guild-log.js';
import { getClearNickname, isNicknameClear } from '../utils/nickname.js';
import { checkSettings } from '../utils/settings-сontroller.js';

export default async function (member) {
	if (
		(await checkSettings(member.guild.id, 'nicknameAutoModeration')) &&
		member.manageable &&
		!isNicknameClear(member.displayName)
	) {
		const correctName = getClearNickname(member.displayName);
		member
			.send(
				`На сервере "**${member.guild.name}**" ваше имя "**${member.displayName}**" было изменено на **${correctName}**, в связи с запретом на не стандартные символы.\nДля его изменения обратитесь к администрации сервера.`
			)
			.catch(() => {});
		member.edit({ nick: correctName });
	}

	await sendLogChannel('memberAdd', member.guild, {
		user: {
			tag: member.user.tag,
			id: member.id,
			createdAt: member.user.createdAt,
			avatar: member.user.displayAvatarURL(),
		},
	});
}
