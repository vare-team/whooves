import { respondError } from '../../utils/modules/respondMessages.js';
import { MessageEmbed } from 'discord.js';
import colors from '../../models/colors.js';
import { randomIntInc } from '../../utils/functions.js';

export const help = {
	name: '8ball',
	description: 'Задайте магическому шару вопрос и он на него ответит',
};

export const command = {
	name: help.name,
	description: help.description,
	options: [
		{
			name: 'вопрос',
			description: 'Вопрос, на который вы хотите получить ответ.',
			type: 3,
			required: true,
			max_length: 100,
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

export function run(interaction) {
	if (100 < interaction.options.getString('вопрос').length)
		return respondError(interaction, `Количество символов в вопросе не должно превышать **100** символов!`);

	if (interaction.options.getString('вопрос').trim()[interaction.options.getString('вопрос').length - 1] !== '?')
		return respondError(interaction, `Вопрос должен оканчиваться знаком вопроса!`);

	const embed = new MessageEmbed()
		.setColor(colors.information)
		.setTitle('Магический шар')
		.addField('Твой вопрос', `\`\`${interaction.options.getString('вопрос')}\`\``);

	if (questions.hasOwnProperty(interaction.options.getString('вопрос').toLowerCase()))
		embed.addField('Ответ шара', `\`\`${questions[interaction.options.getString('вопрос').toLowerCase()]}\`\``);
	else embed.addField('Ответ шара', `\`\`${answers[randomIntInc(0, answers.length - 1)]}\`\``);

	interaction.reply({ embeds: [embed], ephemeral: false });
}

export default {
	help,
	command,
	run,
};
