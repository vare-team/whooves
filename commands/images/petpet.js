import { MessageAttachment, MessageEmbed } from 'discord.js';
import colors from '../../models/colors';
import { createCanvas, loadImage } from 'canvas';
import GifEncoder from 'gif-encoder';

export const help = {
	name: 'petpet',
	description: 'Погладить что-нибудь\n\n*Основано на [PetPet Generator](https://benisland.neocities.org/petpet/)*',
};

export const command = {
	name: help.name,
	description: help.description,
	options: [
		{
			name: 'пользователь',
			description: 'пользователь',
			type: 6,
		},
	],
};

export async function run(interaction) {
	let use = interaction.options.getUser('пользователь') || interaction.user;
	use = use.displayAvatarURL({ format: 'png', dynamic: false, size: 256 });

	await interaction.deferReply();

	const ava = await loadImage(use),
		canvas = createCanvas(256, 256),
		ctx = canvas.getContext('2d'),
		hand = await loadImage('./assets/hand.png');

	const gif = new GifEncoder(256, 256, { highWaterMark: 8 * 1024 * 1024 });
	gif.setFrameRate(16);
	gif.setQuality(20);
	gif.setRepeat(0);
	gif.setTransparent(0x000000);

	gif.writeHeader();

	for (let frame = 0; frame < 5; frame++) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		switch (frame) {
			case 0:
				ctx.drawImage(ava, 41, 50, 207, 213);
				break;
			case 1:
				ctx.drawImage(ava, 37, 77, 213, 189);
				break;
			case 2:
				ctx.drawImage(ava, 33, 97, 229, 171);
				break;
			case 3:
				ctx.drawImage(ava, 33, 85, 212, 177);
				break;
			case 4:
				ctx.drawImage(ava, 38, 48, 201, 216);
				break;
		}
		ctx.drawImage(hand, 112 * frame, 0, 111, 112, 0, 0, canvas.width, canvas.height);

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
