import { respondError, respondSuccess } from '../../utils/respond-messages.js';
import axios from 'axios';
import { ApplicationCommandType, ContextMenuCommandBuilder, EmbedBuilder } from 'discord.js';
import Command from '../../utils/Command.js';

const urlFinder = new RegExp(/https:\/\/[^\s$.?#].[^\s]*/);

export default new Command(
	new ContextMenuCommandBuilder()
		.setName('Unshorten')
		.setNameLocalization('ru', 'Рассократить ссылку')
		.setType(ApplicationCommandType.Message),
	run
);

async function run(interaction) {
	const message = interaction.targetMessage;
	if (!message.content.length)
		return respondError(interaction, 'Для использования этой команды сообщение должно содержать текст!');

	await interaction.deferReply({ ephemeral: true });
	const shortUrl = message.content.match(urlFinder);
	if (shortUrl === null) return respondError(interaction, 'Ссылка не найдена!');

	const { data: url } = await axios.get(`https://unshorten.me/s/${shortUrl[0]}`);
	await respondSuccess(interaction, [new EmbedBuilder().setDescription(url)], true);
}
