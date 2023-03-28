import { respondError, respondSuccess } from '../../utils/respond-messages.js';
import { codeBlock, EmbedBuilder, SlashCommandSubcommandBuilder } from 'discord.js';
import { contrastYiq, hexToRgb, rgbToCmyk, rgbToHsl } from '../../utils/color-converters.js';
import Command from '../../utils/Command.js';

export default new Command(
	new SlashCommandSubcommandBuilder()
		.setName('color')
		.setDescription('hex color converter')
		.setNameLocalization('ru', 'цвет')
		.setDescriptionLocalization('ru', 'Конвертор 16-ричного цвета')
		.addStringOption(option =>
			option
				.setName('color')
				.setDescription('color in hex format (#FFFFFF)')
				.setNameLocalization('ru', 'цвет')
				.setDescriptionLocalization('ru', 'Цвет в шестнадцатиричном формате (#FFFFFF)')
				.setMinLength(6)
				.setMaxLength(7)
				.setRequired(true)
		),
	run
);

async function run(interaction) {
	const colorRaw = interaction.options.getString('color').match(/(#|)[0-9A-Fa-f]{6}/g);
	if (colorRaw === null) return respondError(interaction, 'Вы указали некорректный цвет!');

	const color = colorRaw[0].replace('#', '');
	const rgb = hexToRgb(color);
	const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
	const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

	const embed = new EmbedBuilder()
		.setColor(`#${color}`)
		.setTitle(`Цвет #${color.toUpperCase()}`)
		.setDescription(`Контрастный цвет: ${codeBlock(contrastYiq(rgb.r, rgb.g, rgb.b) ? 'Белый' : 'Чёрный')}`)
		.setImage(`https://singlecolorimage.com/get/${color}/280x80`)
		.addFields([
			{
				name: 'RGB:',
				value:
					codeBlock(`Red:   ${rgb.r}\nGreen: ${rgb.g}\nBlue:  ${rgb.b}\n`) +
					codeBlock('css', `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`),
				inline: true,
			},
			{
				name: 'HSL:',
				value:
					codeBlock(`Hue:        ${hsl.h}\nSaturation: ${hsl.s}%\nLightness:  ${hsl.l}%\n`) +
					codeBlock('css', `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`),
				inline: true,
			},
			{
				name: 'CMYK:',
				value: codeBlock(`Cyan:    ${cmyk.c}%\nMagenta: ${cmyk.m}%\nYellow:  ${cmyk.y}%\nBlack:   ${cmyk.k}%\n`),
				inline: true,
			},
		]);

	await respondSuccess(interaction, embed, false, null, color);
}
