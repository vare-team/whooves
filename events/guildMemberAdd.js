import { sendLogChannel } from '../utils/modules/guildLog.js';
import { getClearNickname, isNicknameClear } from '../utils/modules/nickname.js';
import { checkSettings } from '../utils/modules/settingsController.js';

export default async function (member) {
	if (
		//TODO: бдшка
		(await checkSettings(member.guild.id, 'usernamechecker')) &&
		member.manageable &&
		!isNicknameClear(member.displayName)
	) {
		const correctName = getClearNickname(member.displayName);
		member.send(
			`На сервере "**${member.guild.name}**" ваше имя "**${member.displayName}**" было изменено на **${correctName}**, в связи с запретом на не стандартные символы.\nДля его изменения обратитесь к администрации сервера.`
		);
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
