import { respondError, respondSuccess } from '../../utils/modules/respondMessages.js';
import { codeBlock, EmbedBuilder, SlashCommandSubcommandBuilder } from 'discord.js';
import { randomIntInc } from '../../utils/functions.js';
import Command from '../../models/Command.js';

export default new Command(
	new SlashCommandSubcommandBuilder()
		.setName('8ball')
		.setDescription('ask the ball about something')
		.setNameLocalization('ru', '8шар')
		.setDescriptionLocalization('ru', 'спроси у шара о чем-нибудь')
		.addStringOption(option =>
			option
				.setName('question')
				.setDescription('a question to 8ball')
				.setNameLocalization('ru', 'вопрос')
				.setDescriptionLocalization('ru', 'вопрос для шара')
				.setMaxLength(100)
				.setMinLength(2)
				.setRequired(true)
		),
	run
);

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

export async function run(interaction) {
	const question = interaction.options.getString('question');
	if (question.trim().length < 2)
		return respondError(interaction, `Количество символов в вопросе должно быть не менее 2х !`);

	const embed = new EmbedBuilder().setTitle('Магический шар');
	embed.addFields([
		{ name: 'Твой вопрос', value: codeBlock(question) },
		{
			name: 'Ответ шара',
			value: codeBlock(
				questions.hasOwnProperty(question.toLowerCase())
					? questions[question.toLowerCase()]
					: answers[randomIntInc(0, answers.length - 1)]
			),
		},
	]);

	await respondSuccess(interaction, embed);
}
