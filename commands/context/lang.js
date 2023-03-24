import keyTranslator from '../../utils/translator.js';
import { respondError, respondSuccess } from '../../utils/respond-messages.js';
import { ApplicationCommandType, ContextMenuCommandBuilder, EmbedBuilder } from 'discord.js';
import Command from '../../utils/Command.js';

export default new Command(
	new ContextMenuCommandBuilder()
		.setName('Switch text layout')
		.setNameLocalization('ru', 'Перевод транслита')
		.setType(ApplicationCommandType.Message),
	run
);

function run(interaction) {
	const message = interaction.targetMessage;
	if (message.content.length < 1)
		return respondError(interaction, 'Для использования этой команды сообщение должно содержать текст!');

	let rus = 0,
		eng = 0;

	for (let i = 0; i < message.content.length; i++) {
		const point = message.content.codePointAt(i);

		if (point > 64 && point < 123) eng++;
		else if (point > 1039 && point < 1104) rus++;
	}

	return respondSuccess(
		interaction,
		new EmbedBuilder().setDescription(keyTranslator(message.content, eng >= rus ? 'en2ru' : 'ru2en'))
	);
}
