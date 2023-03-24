import { AttachmentBuilder, EmbedBuilder, SlashCommandSubcommandBuilder } from 'discord.js';

import { createCanvas, loadImage } from 'canvas';

import GifEncoder from 'gif-encoder';
import { respondSuccess } from '../../utils/respond-messages.js';
import Command from '../../utils/Command.js';

export default new Command(
	new SlashCommandSubcommandBuilder()
		.setName('pet')
		.setDescription('pet something')
		.setNameLocalization('ru', 'погладить')
		.setDescriptionLocalization('ru', 'Погладить что-нибудь')
		.addUserOption(option =>
			option
				.setName('user')
				.setDescription('user whose avatar will be used')
				.setNameLocalization('ru', 'пользователь')
				.setDescriptionLocalization('ru', 'пользователь чья аватарка будет использована')
				.setRequired(false)
		)
		.addAttachmentOption(option =>
			option
				.setName('attachment')
				.setDescription('image to be used')
				.setNameLocalization('ru', 'изображение')
				.setDescriptionLocalization('ru', 'изображение которое будет использовано')
				.setRequired(false)
		),
	run
);

async function run(interaction) {
	const attachmentOption = interaction.options.getAttachment('attachment');
	const user = interaction.options.getUser('user') || interaction.member || interaction.user;
	const attachment = attachmentOption ? attachmentOption.url : null;
	const imageRaw = attachment || user.displayAvatarURL({ format: 'png', dynamic: false, size: 256 });

	await interaction.deferReply();

	const image = await loadImage(imageRaw),
		canvas = createCanvas(image.width, image.height),
		ctx = canvas.getContext('2d'),
		hand = await loadImage('./assets/hand.png');

	const gif = new GifEncoder(image.width, image.width, { highWaterMark: 8 * 1024 * 1024 });
	gif.setFrameRate(16);
	gif.setQuality(20);
	gif.setRepeat(0);
	gif.setTransparent(0x000000);

	gif.writeHeader();

	for (let frame = 0; frame < 5; frame++) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		switch (frame) {
			case 0:
				ctx.drawImage(image, 41, 50, 207, 213);
				break;
			case 1:
				ctx.drawImage(image, 37, 77, 213, 189);
				break;
			case 2:
				ctx.drawImage(image, 33, 97, 229, 171);
				break;
			case 3:
				ctx.drawImage(image, 33, 85, 212, 177);
				break;
			case 4:
				ctx.drawImage(image, 38, 48, 201, 216);
				break;
		}
		ctx.drawImage(hand, 112 * frame, 0, 111, 112, 0, 0, canvas.width, canvas.height);

		gif.addFrame(ctx.getImageData(0, 0, canvas.width, canvas.height).data);
	}

	gif.finish();

	const file = new AttachmentBuilder(gif.read(), { name: 'img.gif' });
	const embed = new EmbedBuilder().setImage('attachment://img.gif');

	await respondSuccess(interaction, embed, false, null, null, [file]);
}
