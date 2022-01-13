import { createCanvas, loadImage } from 'canvas'
import { randomIntInc } from '../../utils/functions'
import { respondError } from '../../utils/modules/respondMessages'
import { MessageAttachment, MessageEmbed } from 'discord.js'
import colors from '../../models/colors'
import { contrast, distort, greyscale, invert, sepia } from '../../utils/modules/canvasFilters';

export const help = {
	name: 'filter',
	description: 'Применить фильтр к аватарке',
}

export const command = {
	name: help.name,
	description: help.description,
	options: [
		{
			name: 'фильтр',
			description: 'Фильтр для обработки',
			type: 3,
			required: true,
			choices: [
				{
					name: 'Инверсия',
					value: 'invert',
				},
				{
					name: 'Чёрно-белое',
					value: 'bw',
				},
				{
					name: 'Сепия',
					value: 'sepia',
				},
				{
					name: 'Повышенный контраст',
					value: 'contrast',
				},
				{
					name: 'Искажения',
					value: 'distortion',
				},
				{
					name: 'Глитч',
					value: 'glitch',
				},
			],
		},
		{
			name: 'пользователь',
			description: 'Выбрать аватар пользователя',
			type: 6,
		},
	],
}

String.prototype.replaceAt = (index, replacement) => this.substr(0, index) + replacement + this.substr(index + replacement.length)

export async function run(interaction) {
	let use = interaction.options.getUser('пользователь') || interaction.user

	use = use.displayAvatarURL({ format: 'png', dynamic: false, size: 512 })

	await interaction.deferReply()

	const ava = await loadImage(use),
		canvas = createCanvas(ava.width, ava.height),
		ctx = canvas.getContext('2d')

	ctx.drawImage(ava, 0, 0, ava.width, ava.height)

	switch (interaction.options.getString('фильтр')) {
		case 'invert':
			invert(ctx, 0, 0, ava.width, ava.height)
			break
		case 'bw':
			greyscale(ctx, 0, 0, ava.width, ava.height)
			break
		case 'sepia':
			sepia(ctx, 0, 0, ava.width, ava.height)
			break
		case 'contrast':
			contrast(ctx, 0, 0, ava.width, ava.height)
			break
		case 'distortion':
			distort(ctx, 0, 0, ava.width, ava.height)
			break
		case 'glitch':
			ava.src = canvas.toDataURL('image/jpeg')
			for (let i = 0; i < 5; i++)
				ava.src = ava.src.replaceAt(randomIntInc(50, ava.src.length - 50), '0')
			try {
				ctx.drawImage(ava, 0, 0);
			} catch (e) {
				return respondError(interaction, 'При компиляции файл был повреждён слишком сильно.\nПопробуйте снова через время.')
			}
			break
	}

	const file = new MessageAttachment(canvas.toBuffer(), 'filter.jpeg')
	let embed = new MessageEmbed()
		.setImage('attachment://filter.jpeg')
		.setColor(colors.information)
		.setDescription('Фильтр: ' + interaction.options.getString('фильтр'))

	interaction.editReply({ embeds: [embed], files: [file] });
}

export default {
	help,
	command,
	run
}
