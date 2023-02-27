import { respondError } from '../../utils/modules/respondMessages.js';

export const help = {
	name: 'unshorten',
	description: 'Рассократитель ссылок',
};

export const command = {
	name: help.name,
	type: 3,
};

export const urlFinder = new RegExp(
	/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
);

export async function run(interaction) {
	if (interaction.options.getMessage('message').content.length < 1)
		return respondError(interaction, 'Для использования этой команды сообщение должно содержать текст!');

	await interaction.deferReply({ ephemeral: true });
	const url = interaction.options.getMessage('message').content.match(urlFinder);
	if (url === null) return respondError(interaction, 'Ссылка не найдена!');

	const body = await client.userLib.request(`https://unshorten.me/s/${url}`, {
		//TODO: Axios
		json: true,
	});

	await interaction.editReply({ content: body, ephemeral: true });
}

export default {
	help,
	command,
	run,
};
