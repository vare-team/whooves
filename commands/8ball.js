const rand = require('random');

exports.help = {
    name: "8ball",
    description: "Задайте магическому шару вопрос и он на него ответит!",
    usage: "8ball [вопрос]",
    flag: 3,
    cooldown: 500
};

let answers = ["Бесспорно", "Предрешено", "Никаких сомнений", "Определённо да", "Можешь быть уверен в этом", "Мне кажется — «да»", "Вероятнее всего", "Хорошие перспективы", "Знаки говорят — «да»", "Да", "Пока не ясно, попробуй снова", "Спроси позже", "Лучше не рассказывать", "Сейчас нельзя предсказать", "Сконцентрируйся и спроси опять", "Даже не думай", "Мой ответ — «нет»", "По моим данным — «нет»", "Перспективы не очень хорошие", "Весьма сомнительно"];

exports.run = (client, msg, args, Discord) => {

	client.db.queryValue('SELECT prefix FROM servers WHERE id = ?', [msg.guild.id], (err, prefix) => {
	
		let question = msg.content.slice(prefix.length+6);
	
		if (question == '') {embed = new Discord.RichEmbed().setColor(client.config.colors.err).setTitle('Ошибка!').setDescription(`Вы не задали вопрос!`); return msg.channel.send({embed})};
	
		let embed = new Discord.RichEmbed()
		.setColor(client.config.colors.inf)
		.setTitle('Магический шар')
		.addField('Твой вопрос', `\`\`${question}\`\``)
		.addField('Ответ шара', `\`\`${answers[rand.int(0, 19)]}\`\``)
		.setFooter(msg.author.tag, msg.author.avatarURL);
		
		return msg.channel.send({embed});

	})

};