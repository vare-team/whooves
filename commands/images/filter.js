import { createCanvas, loadImage } from 'canvas';

import { AttachmentBuilder, EmbedBuilder, SlashCommandSubcommandBuilder } from 'discord.js';
import { contrast, distort, greyscale, invert, sepia, glitch } from '../../utils/modules/canvasFilters.js';
import { respondSuccess } from '../../utils/modules/respondMessages.js';
import Command from '../../models/Command.js';

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
				.setChoices([
					{
						name: 'Inversion',
						name_localizations: { ru: 'Инверсия' },
						value: 'invert',
					},
					{
						name: 'Black & White',
						name_localizations: { ru: 'Чёрно-белое' },
						value: 'bw',
					},
					{
						name: 'Sepia',
						name_localizations: { ru: 'Сепия' },
						value: 'sepia',
					},
					{
						name: 'Higher contrast',
						name_localizations: { ru: 'Повышенный контраст' },
						value: 'contrast',
					},
					{
						name: 'Distortion',
						name_localizations: { ru: 'Искажения' },
						value: 'distortion',
					},
					{
						name: 'Glitch',
						name_localizations: { ru: 'Глитч' },
						value: 'glitch',
					},
				])
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

	const user = interaction.options.getUser('user') || interaction.member || interaction.user;
	const attachment = attachmentOption ? attachmentOption.url : null;
	const imageRaw = attachment || user.displayAvatarURL({ format: 'png', dynamic: false, size: 256 });

	await interaction.deferReply();

	const image = await loadImage(imageRaw),
		canvas = createCanvas(image.width, image.height),
		ctx = canvas.getContext('2d');

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
			await glitch(image, canvas, ctx, interaction);
			break;
	}

	const file = new AttachmentBuilder(canvas.toBuffer(), { name: 'filter.jpeg' });
	const embed = new EmbedBuilder().setImage('attachment://filter.jpeg');

	await respondSuccess(interaction, embed, false, null, null, [file]);
}
