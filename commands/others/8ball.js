exports.help = {
	name: '8ball',
	description: 'Задайте магическому шару вопрос и он на него ответит!',
	tier: 0,
	cooldown: 5,
};

exports.command = {
	name: exports.help.name,
	description: exports.help.description,
	options: [
		{
			name: 'вопрос',
			description: 'Вопрос, на который вы хотите получить ответ.',
			type: 3,
			required: true,
		},
	],
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
	'Весьма сомнительно',
];

//TODO добавить больше вопрос/ответ
const questions = {
	'доктор?': 'Доктор Кто',
	'имя доктора?': 'Whooves',
	'когда в3?': 'Завтра',
	'когда v3?': 'Завтра',
};

exports.run = (client, interaction) => {
	if (100 < interaction.options.getString('вопрос').length)
		return client.userLib.retError(interaction, `Количество символов в вопросе не должно превышать **50** символов!`);
	if (interaction.options.getString('вопрос').trim()[interaction.options.getString('вопрос').length - 1] !== '?')
		return client.userLib.retError(interaction, `Вопрос должен оканчиваться знаком вопроса.`);

	let embed = new client.userLib.discord.MessageEmbed()
		.setColor(client.userLib.colors.inf)
		.setTitle('Магический шар')
		.addField('Твой вопрос', `\`\`${interaction.options.getString('вопрос')}\`\``);

	if (questions.hasOwnProperty(interaction.options.getString('вопрос').toLowerCase()))
		embed.addField('Ответ шара', `\`\`${questions[interaction.options.getString('вопрос').toLowerCase()]}\`\``);
	else embed.addField('Ответ шара', `\`\`${answers[client.userLib.randomIntInc(0, answers.length - 1)]}\`\``);

	interaction.reply({ embeds: [embed], ephemeral: false });
};
