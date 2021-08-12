exports.help = {
	name: 'Сменить раскладку',
	description: 'Изменяет раскалдку текста сообщения на противоположную.',
	tier: 0,
};

exports.command = {
	name: exports.help.name,
	type: 3,
};

exports.run = (client, interaction) => {
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
		content: client.userLib.translate(interaction.options.getMessage('message').content, eng >= rus ? 'eng' : 'rus'),
	});
};
