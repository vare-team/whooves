import { createCanvas, loadImage } from 'canvas';
import { AttachmentBuilder, EmbedBuilder, SlashCommandSubcommandBuilder } from 'discord.js';
import { contrast, distort, greyscale, invert, sepia, glitch, glitch_gif } from '../../utils/canvas-filters.js';
import { getMemberOrUser, respondError, respondSuccess } from '../../utils/respond-messages.js';
import Command from '../../utils/Command.js';
import GifEncoder from 'gif-encoder';

export default new Command(
	new SlashCommandSubcommandBuilder()
		.setName('filter')
		.setDescription('apply filter to avatar or attachment')
		.setNameLocalization('ru', 'фильтр')
		.setDescriptionLocalization('ru', 'Применить фильтр к аватарке или изображению')
		.addStringOption(option =>
			option
				.setName('filter')
				.setDescription('filter name')
				.setNameLocalization('ru', 'фильтр')
				.setDescriptionLocalization('ru', 'название фильтра')
				.setChoices(
					{ name: 'Inversion', name_localizations: { ru: 'Инверсия' }, value: 'invert' },
					{ name: 'Black & White', name_localizations: { ru: 'Чёрно-белое' }, value: 'bw' },
					{ name: 'Sepia', name_localizations: { ru: 'Сепия' }, value: 'sepia' },
					{ name: 'Higher contrast', name_localizations: { ru: 'Повышенный контраст' }, value: 'contrast' },
					{ name: 'Distortion', name_localizations: { ru: 'Искажения' }, value: 'distortion' },
					{ name: 'Glitch', name_localizations: { ru: 'Глитч' }, value: 'glitch' },
					{ name: 'Glitch GIF', name_localizations: { ru: 'Глитч анимированная' }, value: 'glitch_gif' }
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
	const filterOption = interaction.options.getString('filter');
	const user = getMemberOrUser(interaction);
	const attachment = attachmentOption?.url ?? null;
	const imageRaw = attachment ?? user.displayAvatarURL({ extension: 'png', forceStatic: true, size: 256 });

	await interaction.deferReply();

	let gif;
	const image = await loadImage(imageRaw);
	const canvas = createCanvas(image.width, image.height);
	const ctx = canvas.getContext('2d');
	if (filterOption === 'glitch_gif') {
		gif = new GifEncoder(image.width, image.height, { highWaterMark: 8 * 1024 * 1024 });
	}

	ctx.drawImage(image, 0, 0, image.width, image.height);

	switch (filterOption) {
		case 'invert':
			invert(ctx, 0, 0, image.width, image.height);
			break;
		case 'bw':
			greyscale(ctx, 0, 0, image.width, image.height);
			break;
		case 'sepia':
			sepia(ctx, 0, 0, image.width, image.height);
			break;
		case 'contrast':
			contrast(ctx, 0, 0, image.width, image.height);
			break;
		case 'distortion':
			distort(ctx, 0, 0, image.width, image.height);
			break;
		case 'glitch':
			try {
				await glitch(ctx, canvas.toDataURL('image/jpeg'));
			} catch (e) {
				return respondError(
					interaction,
					'При компиляции файл был повреждён слишком сильно.\nПопробуйте снова через время.'
				);
			}
			break;
		case 'glitch_gif':
			glitch_gif(ctx, gif, image);
			break;
	}

	const file = new AttachmentBuilder(gif?.read() ?? canvas.toBuffer(), { name: `filter.${gif ? 'gif' : 'jpeg'}` });
	const embed = new EmbedBuilder().setImage(`attachment://filter.${gif ? 'gif' : 'jpeg'}`);
	await respondSuccess(interaction, embed, false, null, null, [file]);
}
