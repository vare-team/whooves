import { respondError, respondSuccess } from '../../utils/modules/respondMessages.js';

export const help = {
	name: 'unwarn',
	description: 'Снять предупреждение с участника',
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
			name: 'id',
			description: 'ID Предупреждения',
			type: 4,
			required: true,
			autocomplete: true,
		},
	],
};

export async function run(interaction) {
	const member = interaction.options.getUser('участник');
	const id = interaction.options.getInteger('id');

	if (!member.id || !id) return;

	const warn = await client.userLib.promise(client.userLib.db, client.userLib.db.delete, 'warns', {
		userId: member.id,
		guildId: interaction.guildId,
		warnId: id,
	});

	if (!warn.res)
		return respondError(interaction, 'Тщательно проверив свои записи, я не нашёл предупреждения с такими данными.');

	if (warn.res > 1) client.userLib.sendLog('Удаление варнов сломалось!');

	respondSuccess(interaction, `С ${interaction.options.getUser('участник')} **снято предупреждение**.`);

	await client.userLib.sendLogChannel('commandUse', interaction.guild, {
		user: { tag: interaction.user.tag, id: interaction.user.id },
		channel: { id: interaction.channelId },
		content: `снятие предупреждения (ID:${id}) с ${member.id}`,
	});
}

export async function autocomplete(ids, interaction) {}

export default {
	help,
	command,
	run,
	autocomplete,
};
