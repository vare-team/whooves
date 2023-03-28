import { respondError, respondSuccess } from '../../utils/respond-messages.js';
import GifEncoder from 'gif-encoder';
import { ApplicationCommandType, AttachmentBuilder, ContextMenuCommandBuilder, EmbedBuilder } from 'discord.js';
import colors from '../../configs/colors.js';
import { createCanvas } from 'canvas';
import Command from '../../utils/Command.js';

export default new Command(
	new ContextMenuCommandBuilder()
		.setName('Ticker')
		.setNameLocalization('ru', 'Бегущая строка')
		.setType(ApplicationCommandType.Message),
	run
);

async function run(interaction) {
	const message = interaction.targetMessage;
	if (!message.content.length)
		return respondError(interaction, 'Для использования этой команды сообщение должно содержать текст!');

	await interaction.deferReply();

	const canvas = createCanvas(856, 128),
		ctx = canvas.getContext('2d'),
		gif = new GifEncoder(canvas.width, canvas.height, { highWaterMark: 8 * 1024 * 1024 }),
		text = message.cleanContent;

	ctx.font = '100px sans-serif';
	ctx.fillStyle = '#FFFFFF';

	gif.setFrameRate(60);
	gif.setQuality(20);
	gif.setRepeat(0);
	gif.setTransparent(0x000000);

	gif.writeHeader();

	for (let i = 1; i < (canvas.width + ctx.measureText(text).width) / 15; i++) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillText(text, canvas.width - 15 * i, canvas.height / 2 + 25);
		gif.addFrame(ctx.getImageData(0, 0, canvas.width, canvas.height).data);
	}

	gif.finish();

	const file = new AttachmentBuilder(gif.read(), { name: 'img.gif' });
	const embed = new EmbedBuilder().setImage('attachment://img.gif').setColor(colors.information);
	await respondSuccess(interaction, embed, false, null, null, [file]);
}
