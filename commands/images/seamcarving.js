import Seamcarver from '../../utils/Seamcarver.js';
import { createCanvas, loadImage } from 'canvas';
import Command from '../../utils/Command.js';
import { AttachmentBuilder, EmbedBuilder, SlashCommandSubcommandBuilder } from 'discord.js';
import colors from '../../configs/colors.js';
import { getMemberOrUser, respondSuccess } from '../../utils/respond-messages.js';

export default new Command(
	new SlashCommandSubcommandBuilder()
		.setName('seamcarving')
		.setDescription('Image compression without loss of useful data')
		.setNameLocalization('ru', 'seamcarving')
		.setDescriptionLocalization('ru', 'Сжатие изображения без потери полезных данных')
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

const config = { field: 'rgb' };

async function run(interaction) {
	const attachmentOption = interaction.options.getAttachment('attachment');
	const user = getMemberOrUser(interaction);
	const attachment = attachmentOption?.url ?? null;
	const imageRaw = attachment ?? user.displayAvatarURL({ extension: 'png', forceStatic: true, size: 256 });

	await interaction.deferReply();

	const ava = await loadImage(imageRaw);
	const canvas = createCanvas(ava.width, ava.height);
	const ctx = canvas.getContext('2d');
	ctx.drawImage(ava, 0, 0, canvas.width, canvas.height);

	let seamCarver = new Seamcarver(canvas);
	for (let i = 0; i < ava.width / 3; i++) await doIterate(seamCarver);
	drawRotated(ctx, canvas, 90);

	seamCarver = new Seamcarver(canvas);
	for (let i = 0; i < ava.height / 3; i++) await doIterate(seamCarver);
	drawRotated(ctx, canvas, -90);

	const file = new AttachmentBuilder(canvas.toBuffer(), { name: 'img.jpg' });
	const embed = new EmbedBuilder().setImage('attachment://img.jpg').setColor(colors.information);
	await respondSuccess(interaction, embed, false, null, null, [file]);
}

function drawRotated(ctx, canvas, degrees) {
	const hiddenCanvas = createCanvas(canvas.height, canvas.width);
	const hiddenCtx = hiddenCanvas.getContext('2d');

	hiddenCtx.save();
	hiddenCtx.translate(canvas.height / 2, canvas.width / 2);
	hiddenCtx.rotate(-degrees * (Math.PI / 180));
	hiddenCtx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
	hiddenCtx.restore();

	canvas.width = hiddenCanvas.width;
	canvas.height = hiddenCanvas.height;
	ctx.drawImage(hiddenCanvas, 0, 0, hiddenCanvas.width, hiddenCanvas.height);
}

async function doIterate(seamCarver) {
	seamCarver.removeVerticalSeam(seamCarver.findVerticalSeam());
	seamCarver.reDrawImage(config);
}
