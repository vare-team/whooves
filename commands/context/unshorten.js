import { respondError, respondSuccess } from '../../utils/modules/respondMessages.js';
import axios from 'axios';
import { ApplicationCommandType, ContextMenuCommandBuilder, EmbedBuilder } from 'discord.js';
import Command from '../../models/Command.js';

export default new Command(
	new ContextMenuCommandBuilder()
		.setName('Unshorten')
		.setNameLocalization('ru', 'Рассократить ссылку')
		.setType(ApplicationCommandType.Message),
	run
);

export const urlFinder = new RegExp(
	/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
);

async function run(interaction) {
	const message = interaction.targetMessage;
	if (message.content.length < 1)
		return await respondError(interaction, 'Для использования этой команды сообщение должно содержать текст!');

	await interaction.deferReply({ ephemeral: true });
	const url = message.content.match(urlFinder);
	if (url === null) return respondError(interaction, 'Ссылка не найдена!');

	const body = await axios.get(`https://unshorten.me/s/${url}`, {
		transformResponse: data => JSON.parse(data),
	});

	await respondSuccess(interaction, new EmbedBuilder().setDescription(body.data), true);
}
