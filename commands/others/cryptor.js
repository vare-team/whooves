import { EmbedBuilder, codeBlock, SlashCommandSubcommandBuilder } from 'discord.js';
import { respondSuccess } from '../../utils/modules/respondMessages.js';
import Command from '../../models/Command.js';

export default new Command(
	new SlashCommandSubcommandBuilder()
		.setName('cryptor')
		.setDescription('message cipher tool')
		.setNameLocalization('ru', 'криптор')
		.setDescriptionLocalization('ru', 'Простенький шифратор сообщений.')
		.addStringOption(option => {
			option
				.setName('mode')
				.setDescription('cryptor mode')
				.setNameLocalization('ru', 'режим')
				.setDescriptionLocalization('ru', 'режим работы')
				.setChoices([
					{
						name: 'Crypt',
						name_localizations: { ru: 'Зашифровать' },
						value: 'crypt',
					},
					{
						name: 'Decrypt',
						name_localizations: { ru: 'Дешифровать' },
						value: 'decrypt',
					},
				])
				.setRequired(true);
		})
		.addStringOption(option =>
			option
				.setName('text')
				.setDescription('text of message to (de-)crypt')
				.setNameLocalization('ru', 'текст')
				.setDescriptionLocalization('ru', 'текст для за/де-шифровки')
				.setMinLength(2)
				.setMaxLength(256)
				.setRequired(true)
		),
	run
);

function run(interaction) {
	const mode = interaction.options.getString('mode');
	const text = interaction.options.getString('текст');
	const embed = new EmbedBuilder().setTitle('🔐 Encryptor');

	switch (mode) {
		case 'crypt':
			embed.setDescription(`Режим: **шифровка**\n${codeBlock(crypt(text))}`);
			break;

		case 'decrypt':
			embed.setDescription(`Режим: **дешифровка**\n${codeBlock(decrypt(text))}`);
			break;
	}

	return respondSuccess(interaction, embed, true);
}

function crypt(text) {
	let crypted = '';
	const cryptSeed = text.charCodeAt(0);
	crypted += String.fromCodePoint(text.charCodeAt(0) + 11);
	for (let i = 1; i < text.length; i++) {
		crypted += String.fromCodePoint(text.charCodeAt(i) + i + cryptSeed);
	}
	return crypted;
}

function decrypt(crypted) {
	let text = '';
	const cryptSeed = crypted.charCodeAt(0) - 11;
	text += String.fromCodePoint(crypted.charCodeAt(0) - 11);
	for (let i = 1; i < crypted.length; i++) {
		if (crypted.charCodeAt(i) - i - cryptSeed > 0) text += String.fromCodePoint(crypted.charCodeAt(i) - i - cryptSeed);
	}
	return text;
}
