import {respondError} from "../../utils/modules/respondMessages.js";
import {MessageEmbed} from "discord.js";
import colors from "../../models/colors.js";

export const help = {
	name: 'clearmsgid',
	description: 'Очистить канал до определённого сообщения',
};

export async function run (msg, args) {
	if (/([0-9]){18,19,20,21}/.test(args[0]))
		return respondError(msg, 'ID сообщения введено не верно!');

	const currentMsg = await msg.channel.messages.fetch(args[0]).catch(() => 0);
	if (!currentMsg || currentMsg.channel.id !== msg.channel.id)
		return respondError(msg, 'Сообщение не найдено!');

	const messages = (await msg.channel.messages.fetch()).filter(message => message.id >= currentMsg.id);
	const dmsg = await msg.channel.bulkDelete(messages, true);

	const embed = new MessageEmbed()
		.setColor(colors.success)
		.setTitle('Удаление сообщений')
		.setDescription(`Сообщения были удалены (**${dmsg.size}**)!`)
		.setTimestamp();

	msg.channel.send(embed).then(msgs => msgs.delete({ timeout: 10000 }));
}

export default {
	help,
	run
}
