exports.help = {
	name: "cryptor",
	description: "Простенький шифратор сообщений.\n\`\`crypt - Зашифровать\ndecrypt - Расшифровать\`\`",
	aliases: ['crypt'],
	usage: [{type: 'text', opt: 0, name: 'режим'}, {type: 'text', opt: 0, name: 'текст'}],
	dm: 1,
	tier: 0,
	cooldown: 1
};

exports.run = (client, msg, args) => {
	let embed = new client.userLib.discord.MessageEmbed().setColor(client.userLib.colors.inf).setTitle("Cryptor").setFooter(msg.author.tag, msg.author.displayAvatarURL());

	switch (args[0]) {
		case 'crypt':
			embed.setDescription('```' + crypt(args.slice(1).join(' ')) + '```')
			break;

		case 'decrypt':
			embed.setDescription('```' + decrypt(args.slice(1).join('')) + '```')
			break;
	}

	msg.channel.send(embed);
};

function crypt(text) {
	let crypted = "";
	let cryptSeed = text.charCodeAt(0);
	crypted += String.fromCodePoint(text.charCodeAt(0) + 11);
	for (let i = 1; i < text.length; i++) {
		crypted += String.fromCodePoint(text.charCodeAt(i) + i + cryptSeed);
	}
	return crypted;
}

function decrypt(crypted) {
	let text = "";
	let cryptSeed = crypted.charCodeAt(0) - 11;
	text += String.fromCodePoint(crypted.charCodeAt(0) - 11);
	for (let i = 1; i < crypted.length; i++) {
		text += String.fromCodePoint(crypted.charCodeAt(i) - i - cryptSeed);
	}
	return text;
}