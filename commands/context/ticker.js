import { respondError } from '../../utils/modules/respondMessages.js';
import GifEncoder from 'gif-encoder';
import { MessageAttachment, MessageEmbed } from 'discord.js';
import colors from '../../models/colors.js';
import { createCanvas } from 'canvas';

export const help = {
	name: 'бегущая строка',
	description: 'Переводит текст сообщения в бегущую строку',
};

export const command = {
	name: help.name,
	type: 3,
};

export async function run(interaction) {
	if (interaction.options.getMessage('message').content.length < 1)
		return respondError(interaction, 'Для использования этой команды сообщение должно содержать текст!');

	await interaction.deferReply();

	const canvas = createCanvas(856, 128),
		ctx = canvas.getContext('2d'),
		gif = new GifEncoder(canvas.width, canvas.height, { highWaterMark: 8 * 1024 * 1024 }),
		text = interaction.options.getMessage('message').cleanContent;

	ctx.font = '100px sans-serif';
	ctx.fillStyle = '#FFFFFF';

	gif.setFrameRate(8);
	gif.setQuality(20);
	gif.setRepeat(0);
	gif.setTransparent(0x000000);

	gif.writeHeader();

	for (let i = 1; i < (canvas.width + ctx.measureText(text).width) / 50; i++) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		// ctx.fillText(i, 0, 64)
		ctx.fillText(text, canvas.width - 50 * i, canvas.height / 2 + 25);
		gif.addFrame(ctx.getImageData(0, 0, canvas.width, canvas.height).data);
	}

	gif.finish();

	const file = new MessageAttachment(gif.read(), 'img.gif');
	const embed = new MessageEmbed().setImage('attachment://img.gif').setColor(colors.information);

	interaction.editReply({ embeds: [embed], files: [file] });
}

export default {
	help,
	command,
	run,
};
