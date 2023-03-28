import { AttachmentBuilder, EmbedBuilder, SlashCommandSubcommandBuilder } from 'discord.js';
import { createCanvas, loadImage } from 'canvas';
import GifEncoder from 'gif-encoder';
import { getMemberOrUser, respondSuccess } from '../../utils/respond-messages.js';
import Command from '../../utils/Command.js';

export default new Command(
	new SlashCommandSubcommandBuilder()
		.setName('roll')
		.setDescription('roll something')
		.setNameLocalization('ru', 'повернуть')
		.setDescriptionLocalization('ru', 'повернуть что-нибудь')
		.addStringOption(option =>
			option
				.setName('direction')
				.setDescription('rotate direction')
				.setNameLocalization('ru', 'направление')
				.setDescriptionLocalization('ru', 'направление поворота')
				.setChoices(
					{ name: 'Clockwise', name_localizations: { ru: 'По часовой' }, value: 'right' },
					{ name: 'Counterclockwise', name_localizations: { ru: 'Против часовой' }, value: 'left' }
				)
				.setRequired(true)
		)
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
	const direction = interaction.options.getString('direction') === 'right' ? 10 : -10;
	const user = getMemberOrUser(interaction);
	const attachment = attachmentOption?.url ?? null;
	const imageRaw = attachment ?? user.displayAvatarURL({ extension: 'png', forceStatic: true, size: 256 });

	await interaction.deferReply();

	const image = await loadImage(imageRaw),
		canvas = createCanvas(image.width, image.height),
		ctx = canvas.getContext('2d');
	const gif = new GifEncoder(image.width, image.height, { highWaterMark: 8 * 1024 * 1024 });
	gif.setFrameRate(24);
	gif.setQuality(20);
	gif.setRepeat(0);
	gif.setTransparent(0x000000);

	gif.writeHeader();

	for (let frame = 1; frame < 37; frame++) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.save();
		ctx.translate(canvas.width / 2, canvas.height / 2);
		ctx.rotate((frame * direction * Math.PI) / 180);
		ctx.drawImage(image, -canvas.width / 2, -canvas.width / 2, image.width, image.height);
		ctx.globalCompositeOperation = 'destination-in';
		ctx.beginPath();
		ctx.arc(0, 0, canvas.width / 2, 0, Math.PI * 2);
		ctx.closePath();
		ctx.fill();
		ctx.restore();

		gif.addFrame(ctx.getImageData(0, 0, canvas.width, canvas.height).data);
	}

	gif.finish();

	const file = new AttachmentBuilder(gif.read(), { name: 'img.gif' });
	const embed = new EmbedBuilder().setImage('attachment://img.gif');
	await respondSuccess(interaction, embed, false, null, null, [file]);
}
