import { respondError, respondSuccess } from '../../utils/modules/respondMessages.js';
import promise from '../../utils/promise.js';

export const help = {
	name: 'ban',
	description: 'Выдать бан участнику.',
	extraPermissions: ['BAN_MEMBERS'],
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
			description: 'Причина бана',
			type: 3,
		},
		{
			name: 'force',
			description: 'Игнорировать количество варнов',
			type: 5,
		},
		{
			name: 'clearmsg',
			description: 'Очистить сообщения участника',
			type: 5,
		},
	],
};

export async function run (interaction) {
	const member = interaction.options.getMember('участник')
	const clearmsg = interaction.options.getBoolean('clearmsg')
	const reason = interaction.options.getString('причина') || 'Причина не указана'

	if (!member.bannable)
		return respondError(interaction, 'Я не могу забанить этого участника!\nЕго защитная магия превосходит мои умения!');

	if (!interaction.options.getBoolean('force')) {
		const warns = (await promise(client.userLib.db, client.userLib.db.count, 'warns', {
			userId: member.id,
			guildId: interaction.guildId,
		})).res;

		if (warns < 5)
			return respondError(interaction, 'Для выдачи бана необходимо **5** варнов!\nИспользуй аргумент `force` для бана.');
	}

	await member.send(
		`Вам был выдан бан на сервере \`\`${interaction.guild.name}\`\`, модератором \`\`${interaction.user.tag}\`\`, по причине: ${reason}`
	).catch(() => client.userLib.sendLog(`${help.name} : DM Send catch! Guild ${interaction.guild.name} (ID:${interaction.guildId}), @${member.tag} (ID:${member.id})`, 'DM_SEND_ERROR'));

	await interaction.guild.members.ban(member, { reason: interaction.user.tag + ': ' + reason, days: clearmsg ? 7 : 0 });

	respondSuccess(interaction, `${member} **был забанен!** ***||*** ${reason}`);
}

export default {
	help,
	command,
	run
}
