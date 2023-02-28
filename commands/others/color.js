import { respondError } from '../../utils/modules/respondMessages.js'
import { MessageEmbed } from 'discord.js'
import { contrastYiq, hexToRgb, rgbToCmyk, rgbToHsl } from '../../utils/modules/colorConverters.js';
import { codeBlock, cssBlock } from '../../utils/functions.js';

export const help = {
	name: 'color',
	description: 'Конвертор 16-ричного цвета',
}

export const command = {
	name: help.name,
	description: help.description,
	options: [
		{
			name: 'цвет',
			description: 'Цвет в шестнадцатиричном формате (#FFFFFF)',
			type: 3,
			required: true,
			min_length: 6,
			max_length: 7
		},
	],
}

export function run(interaction) {
	let color = interaction.options.getString('цвет').match(/(#|)[0-9A-Fa-f]{6}/g)

	if (color === null) respondError(interaction, 'Вы указали некорректный цвет!');

	color = color[0].replace('#', '');

	const rgb = hexToRgb(color),
		cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b),
		hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

	const embed = new MessageEmbed()
		.setColor(color)
		.setTitle(`Цвет #${color.toUpperCase()}`)
		.setDescription(`Контрастный цвет: \`\`${contrastYiq(rgb.r, rgb.g, rgb.b) ? 'Белый' : 'Чёрный'}\`\``)
		.setImage(`https://singlecolorimage.com/get/${color}/280x80`)
		.addFields([
			{
				name: 'RGB:',
				value: codeBlock((
					codeBlock((
						`Red:   ${rgb.r}\n` +
						`Green: ${rgb.g}\n` +
						`Blue:  ${rgb.b}\n`
					)) +
					cssBlock(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)
				)),
				inline: true
			},
			{
				name: 'HSL:',
				value: codeBlock((
					codeBlock((
						`Hue:        ${hsl.h}\n` +
						`Saturation: ${hsl.s}%\n` +
						`Lightness:  ${hsl.l}%\n`
					)) +
					cssBlock(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)
				)),
				inline: true
			},
			{
				name: 'CMYK:',
				value: codeBlock((
					`Cyan:    ${cmyk.c}%\n` +
					`Magenta: ${cmyk.m}%\n` +
					`Yellow:  ${cmyk.y}%\n` +
					`Black:   ${cmyk.k}%\n`
				)),
				inline: true
			}
		])


	interaction.reply({ embeds: [embed] });
}

export default {
	help,
	command,
	run,
};
