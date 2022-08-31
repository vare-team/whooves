import {createCanvas, loadImage} from "canvas";

import { MessageAttachment, MessageEmbed } from 'discord.js'
import colors from '../../models/colors.js'
import { contrast, distort, greyscale, invert, sepia, glitch } from '../../utils/modules/canvasFilters.js'

export const help = {
	name: 'filter',
	description: 'Применить фильтр к аватарке',
};

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
};

String.prototype.replaceAt = (index, replacement) =>
	this.substr(0, index) + replacement + this.substr(index + replacement.length);

export async function run(interaction) {
	let use = interaction.options.getUser('пользователь') || interaction.user;

	use = use.displayAvatarURL({ format: 'png', dynamic: false, size: 512 });

	await interaction.deferReply();

	const ava = await loadImage(use),
		canvas = createCanvas(ava.width, ava.height),
		ctx = canvas.getContext('2d');

	ctx.drawImage(ava, 0, 0, ava.width, ava.height);

	switch (interaction.options.getString('фильтр')) {
		case 'invert':
			invert(ctx, 0, 0, ava.width, ava.height);
			break;
		case 'bw':
			greyscale(ctx, 0, 0, ava.width, ava.height);
			break;
		case 'sepia':
			sepia(ctx, 0, 0, ava.width, ava.height);
			break;
		case 'contrast':
			contrast(ctx, 0, 0, ava.width, ava.height);
			break;
		case 'distortion':
			distort(ctx, 0, 0, ava.width, ava.height);
			break;
		case 'glitch':
			glitch(ava, canvas,ctx, interaction);
			break
	}

	const file = new MessageAttachment(canvas.toBuffer(), 'filter.jpeg');
	const embed = new MessageEmbed()
		.setImage('attachment://filter.jpeg')
		.setColor(colors.information)
		.setDescription(`Фильтр: ${interaction.options.getString('фильтр')}`);

	await interaction.editReply({ embeds: [embed], files: [file] });
}

export default {
	help,
	command,
	run,
};
