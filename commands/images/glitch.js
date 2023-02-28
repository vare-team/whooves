import { MessageAttachment, MessageEmbed } from 'discord.js'
import colors from '../../models/colors.js'

import {createCanvas, loadImage} from "canvas";

import { randomIntInc } from '../../utils/functions.js'
import GifEncoder from 'gif-encoder'

export const help = {
	name: 'glitch',
	description: 'Глитч эффект.',
}

export const command = {
	name: help.name,
	description: help.description,
	options: [
		{
			name: 'пользователь',
			description: 'пользователь',
			type: 6,
		},
		{
			name: 'качество',
			description: 'Разрашение аватарки',
			type: 4,
			choices: [
				{
					name: '64x64',
					value: 64,
				},
				{
					name: '128x128',
					value: 128,
				},
				{
					name: '256x256',
					value: 256,
				},
				{
					name: '512x512',
					value: 512,
				},
			],
		},
	],
}

export async function run(interaction) {
	let use = interaction.options.getUser('пользователь') || interaction.user
	const size = interaction.options.getInteger('качество') ? interaction.options.getInteger('качество') : 128

	use = use.displayAvatarURL({ format: 'png', dynamic: false, size: size })

	await interaction.deferReply()

	const ava = await loadImage(use),
		canvas = createCanvas(size, size),
		ctx = canvas.getContext('2d');
	const gif = new GifEncoder(size, size, { highWaterMark: 8 * 1024 * 1024 });

	gif.setFrameRate(24);
	gif.setQuality(30);
	gif.setRepeat(0);
	gif.setTransparent(0x000000);

	gif.writeHeader();

	ctx.drawImage(ava, 0, 0, size, size);

	for (let frame = 1; frame < 37; frame++) {
		ctx.drawImage(
			ava,
			randomIntInc(-15, 15),
			randomIntInc(-15, 15),
			randomIntInc(size - size / 1.8, size + size * 1.3),
			randomIntInc(size - size / 1.8, size + size * 1.3)
		);

		let glitch = ctx.getImageData(
			randomIntInc(1, size - 1),
			randomIntInc(1, size - 1),
			randomIntInc(1, size - 1),
			randomIntInc(1, size - 1)
		);
		for (let i = 0; i < glitch.data.length; i += 4) {
			glitch.data[i] = 255 - glitch.data[i];
			glitch.data[i + 1] = 255 - glitch.data[i + 1];
			glitch.data[i + 2] = 255 - glitch.data[i + 2];
		}
		ctx.putImageData(glitch, randomIntInc(1, size - size / 1.5), randomIntInc(1, size - size / 1.6))

		glitch = ctx.getImageData(
			randomIntInc(1, size - 1),
			randomIntInc(1, size - 1),
			randomIntInc(1, size - 1),
			randomIntInc(1, size - 1)
		);
		for (let i = 0; i < glitch.data.length; i += 4) {
			glitch.data[i] = glitch.data[i] * 3.59 + -331.52;
			glitch.data[i + 1] = glitch.data[i + 1] * 3.59 + -331.52;
			glitch.data[i + 2] = glitch.data[i + 2] * 3.59 + -331.52;
		}
		ctx.putImageData(glitch, randomIntInc(1, size - size / 1.4), randomIntInc(1, size - size / 1.8))

		glitch = ctx.getImageData(
			randomIntInc(1, size - 1),
			randomIntInc(1, size - 1),
			randomIntInc(1, size - 1),
			randomIntInc(1, size - 1)
		);
		ctx.putImageData(glitch, randomIntInc(1, size - size / 1.3), randomIntInc(1, size - size / 2))

		gif.addFrame(ctx.getImageData(0, 0, canvas.width, canvas.height).data);
	}

	gif.finish();

	const file = new MessageAttachment(gif.read(), 'img.gif');
	const embed = new MessageEmbed().setImage('attachment://img.gif').setColor(colors.information);
	await interaction.editReply({ embeds: [embed], files: [file] });
}

export default {
	help,
	command,
	run,
};
