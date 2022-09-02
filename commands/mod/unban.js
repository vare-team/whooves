import {respondError, respondSuccess} from "../../utils/modules/respondMessages.js";

export const help = {
	name: 'unban',
	description: 'Разбанить участника',
	extraPermissions: ['BAN_MEMBERS'],
};

export const command = {
	name: help.name,
	description: help.description,
	options: [
		{
			name: 'id',
			description: 'ID пользователя',
			type: 3,
			required: true,
		},
	],
};

export async function run (interaction) {
	const user = await interaction.client.users.fetch(interaction.options.getString('id')).catch(() => {}) || undefined;
	const ban = await interaction.guild.bans.fetch({ user, force: true }).catch(() => {}) || undefined;

	if (user === undefined)
		return respondError(interaction, 'Пользователь не найден!');
	if (ban === undefined)
		return respondError(interaction, 'Пользователь не забанен!');

	await interaction.guild.members.unban(user).catch(() => {});

	respondSuccess(interaction, `\`${user.tag}\` **был разбанен!**`);
}

export default {
	help,
	command,
	run
}
