exports.help = {
	name: 'cryptor',
	description: 'Простенький шифратор сообщений.\n``crypt - Зашифровать\ndecrypt - Расшифровать``',
	aliases: ['crypt', 'encrypt', 'ct'],
	usage: [
		{ type: 'text', opt: 0, name: 'режим' },
		{ type: 'text', opt: 0, name: 'текст' },
	],
	dm: 1,
	tier: 0,
	cooldown: 1,
};

exports.run = (client, msg, args) => {
	let embed = new client.userLib.discord.MessageEmbed()
		.setColor(client.userLib.colors.inf)
		.setTitle('🔐 Encryptor')
		.setFooter(msg.author.tag, msg.author.displayAvatarURL());

	switch (args[0]) {
		case 'crypt':
			embed.setDescription('Режим: **шифровка**\n```' + crypt(args.slice(1).join(' ')) + '```');
			break;

		case 'decrypt':
			embed.setDescription('Режим: **дешифровка**\n```' + decrypt(args.slice(1).join('')) + '```');
			break;

		default:
			return client.userLib.retError(msg, 'Указан неверный режим!');
	}

	msg.channel.send(embed);
};

function crypt(text) {
	let crypted = '';
	let cryptSeed = text.charCodeAt(0);
	crypted += String.fromCodePoint(text.charCodeAt(0) + 11);
	for (let i = 1; i < text.length; i++) {
		crypted += String.fromCodePoint(text.charCodeAt(i) + i + cryptSeed);
	}
	return crypted;
}

function decrypt(crypted) {
	let text = '';
	let cryptSeed = crypted.charCodeAt(0) - 11;
	text += String.fromCodePoint(crypted.charCodeAt(0) - 11);
	for (let i = 1; i < crypted.length; i++) {
		if (crypted.charCodeAt(i) - i - cryptSeed > 0) text += String.fromCodePoint(crypted.charCodeAt(i) - i - cryptSeed);
	}
	return text;
}
