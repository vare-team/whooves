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
	if (interaction.options.getMessage('message').content.length < 1)
		return respondError(interaction, 'Для использования этой команды сообщение должно содержать текст!');

	let rus = 0,
		eng = 0;

	for (let i = 0; i < interaction.options.getMessage('message').content.length; i++) {
		if (
			interaction.options.getMessage('message').content.codePointAt(i) > 64 &&
			interaction.options.getMessage('message').content.codePointAt(i) < 123
		)
			eng++;
		if (
			interaction.options.getMessage('message').content.codePointAt(i) > 1039 &&
			interaction.options.getMessage('message').content.codePointAt(i) < 1104
		)
			rus++;
	}

	interaction.reply({
		content: keyTranslator(interaction.options.getMessage('message').content, eng >= rus ? 'en2ru' : 'ru2en'),
	});
}

export default {
	help,
	command,
	run,
};
