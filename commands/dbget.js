exports.help = {
    name: "dbget",
    description: "",
    usage: "",
    flag: 0
};

exports.run = (client, msg, args) => {
	let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    word = '';

	for(let i = 0; i < 12; i++) {
	    word += alphabet[Math.round(Math.random() * (alphabet.length - 1))];
	    if (i == 3 || i == 7) word += "-";
	};

	msg.channel.send(`Key is \`\`${word}\`\`\nKey owner \`\`${msg.author.tag}\`\``);
};