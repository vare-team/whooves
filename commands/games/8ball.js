exports.help = {
  name: "8ball",
  description: "Задайте магическому шару вопрос и он на него ответит!",
	aliases: ['ball', 'bl', '8'],
  usage: "[вопрос]",
	dm: 0,
  tier: 0,
  cooldown: 5
};

const answers = [
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

const questions = {
	'доктор': 'Доктор Кто',
	'имя доктора': 'Whooves'
};

exports.run = (client, msg, args) => {
	
	let embed = new client.userLib.discord.RichEmbed()
		.setColor(client.userLib.colors.inf)
		.setTitle('Магический шар')
		.addField('Твой вопрос', `\`\`${args.join(' ')}\`\``)
		.setFooter(msg.author.tag, msg.author.avatarURL);
	
	if (questions.hasOwnProperty(args.join(' ').toLowerCase())) embed.addField('Ответ шара', `\`\`${questions[args.join(' ').toLowerCase()]}\`\``);
	else embed.addField('Ответ шара', `\`\`${answers[client.userLib.randomIntInc(0, answers.length - 1)]}\`\``);
		
	msg.channel.send(embed);
};