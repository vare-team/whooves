import keyTranslator from '../../utils/modules/keyTranslator.js';
import { respondError } from '../../utils/modules/respondMessages.js';

export const help = {
	name: 'Switch text layout',
	description: 'Изменяет раскладку текста сообщения на противоположную. (QWERTY <=> ЙЦУКЕН)',
};

export const command = {
	name: help.name,
	type: 3,
};

export function run(interaction) {
	const message = interaction.options.getMessage('message');
	if (message.content.length < 1)
		return respondError(interaction, 'Для использования этой команды сообщение должно содержать текст!');

	let rus = 0,
		eng = 0;

	for (let i = 0; i < message.content.length; i++) {
		const point = message.content.codePointAt(i);

		if (point > 64 && point < 123) eng++;

		if (point > 1039 && point < 1104) rus++;
	}

	interaction.reply({
		content: keyTranslator(message.content, eng >= rus ? 'en2ru' : 'ru2en'),
	});
}

export default {
	help,
	command,
	run,
};
