exports.help = {
	name: 'cryptor',
	description: 'Простенький шифратор сообщений.',
};

exports.command = {
	name: exports.help.name,
	description: exports.help.description,
	options: [
		{
			name: 'режим',
			description: 'Режим работы',
			type: 3,
			required: true,
			choices: [
				{
					name: 'Зашифровать',
					value: 'crypt',
				},
				{
					name: 'Дешифровать',
					value: 'decrypt',
				},
			],
		},
		{
			name: 'текст',
			description: 'Текст',
			type: 3,
			required: true,
		},
	],
};

exports.run = (client, interaction) => {
	const embed = new client.userLib.discord.MessageEmbed().setColor(client.userLib.colors.inf).setTitle('🔐 Encryptor');

	switch (interaction.options.getString('режим')) {
		case 'crypt':
			embed.setDescription(`Режим: **шифровка**\n\`\`\`${crypt(interaction.options.getString('текст'))}\`\`\``);
			break;

		case 'decrypt':
			embed.setDescription(`Режим: **дешифровка**\n\`\`\`${decrypt(interaction.options.getString('текст'))}\`\`\``);
			break;

		default:
			return client.userLib.retError(interaction, 'Указан неверный режим!');
	}

	interaction.reply({ embeds: [embed], ephemeral: true });
};

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
