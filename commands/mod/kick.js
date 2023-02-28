import { respondError, respondSuccess } from '../../utils/modules/respondMessages.js';

export const help = {
	name: 'kick',
	description: 'Кикнуть участника.',
	extraPermissions: ['KICK_MEMBERS'],
};

export const command = {
	name: help.name,
	description: help.description,
	options: [
		{
			name: 'участник',
			description: 'Участник сервера',
			type: 6,
			required: true,
		},
		{
			name: 'причина',
			description: 'Причина исключения',
			type: 3,
		},
	],
};

export async function run (interaction) {
	const member = interaction.options.getMember('участник')
	const reason = interaction.options.getString('причина') || 'Причина не указана';

	if (!member.kickable)
		return respondError(interaction, 'Я не могу кикнуть этого участника!\nЕго защитная магия превосходит мои умения!');

	await member.send(
		`Вы были кикнуты с сервера \`\`${interaction.guild.name}\`\`, модератором \`\`${interaction.user.tag}\`\`, по причине: ${reason}`
	).catch(() => client.userLib.sendLog(`${exports.help.name} : DM Send catch! Guild ${interaction.guild.name} (ID:${interaction.guildId}), @${member.tag} (ID:${member.id})`, 'DM_SEND_ERROR'));

	await member.kick(interaction.user.tag + ": " + reason);

	respondSuccess(interaction, `${member} **был кикнут!** ***||*** ${reason}`);
}

export default {
	help,
	command,
	run
}
