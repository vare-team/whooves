let answers = [
	'Бесспорно',
	'Предрешено',
	'Никаких сомнений',
	'Определённо да',
	'Можешь быть уверен в этом',
	'Мне кажется — «да»',
	'Вероятнее всего',
	'Хорошие перспективы',
	'Знаки говорят — «да»',
	'Да',
	'Пока не ясно, попробуй снова',
	'Спроси позже',
	'Лучше не рассказывать',
	'Сейчас нельзя предсказать',
	'Сконцентрируйся и спроси опять',
	'Даже не думай',
	'Мой ответ — «нет»',
	'По моим данным — «нет»',
	'Перспективы не очень хорошие',
	'Весьма сомнительно'
];

exports.help = {
    name: "8ball",
    description: "Задайте магическому шару вопрос и он на него ответит!",
    usage: "[вопрос]",
    flag: 3,
    cooldown: 500
};

exports.run = (client, msg, args) => {
		let embed = new client.userLib.discord.RichEmbed()
		.setColor(client.userLib.colors.inf)
		.setTitle('Магический шар')
		.addField('Твой вопрос', `\`\`${args.join(' ')}\`\``)
		.addField('Ответ шара', `\`\`${answers[client.userLib.randomIntInc(0, answers.length - 1)]}\`\``)
		.setFooter(msg.author.tag, msg.author.avatarURL);
		
		msg.channel.send(embed);
};