import { respondError } from '../../utils/modules/respondMessages';
import { MessageEmbed } from 'discord.js';
import { contrastYiq, hexToRgb, rgbToCmyk, rgbToHsl } from '../../utils/modules/colorConverters';

export const help = {
	name: 'color',
	description: 'Конвертор 16-ричного цвета',
};

export const command = {
	name: help.name,
	description: help.description,
	options: [
		{
			name: 'цвет',
			description: 'Цвет в шестнадцатиричном формате (#FFFFFF)',
			type: 3,
			required: true,
		},
	],
};

export function run(interaction) {
	let color = interaction.options.getString('цвет').match(/(#|)[0-9A-Fa-f]{6}/g);

	if (color === null) respondError(interaction, 'Вы указали некорректный цвет!');

	color = color[0].replace('#', '');

	const rgb = hexToRgb(color),
		cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b),
		hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

	const embed = new MessageEmbed()
		.setColor(color)
		.setTitle(`Цвет #${color.toUpperCase()}`)
		.setDescription(`Контрастный цвет: \`\`${contrastYiq(rgb.r, rgb.g, rgb.b) ? 'Белый' : 'Чёрный'}\`\``)
		.addField(
			'RGB:',
			`\`\`\`Red:   ${rgb.r}\nGreen: ${rgb.g}\nBlue:  ${rgb.b}\n\`\`\`\`\`\`css\nrgb(${rgb.r}, ${rgb.g}, ${rgb.b})\`\`\``,
			true
		)
		.addField(
			'HSL:',
			`\`\`\`Hue:        ${hsl.h}\nSaturation: ${hsl.s}%\nLightness:  ${hsl.l}%\n\`\`\`\`\`\`css\nhsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)\`\`\``,
			true
		)
		.addField(
			'CMYK:',
			`\`\`\`Cyan:    ${cmyk.c}%\nMagenta: ${cmyk.m}%\nYellow:  ${cmyk.y}%\nBlack:   ${cmyk.k}%\n\`\`\``,
			false
		)
		.setImage(`https://singlecolorimage.com/get/${color}/280x80`);

	interaction.reply({ embeds: [embed] });
}

export default {
	help,
	command,
	run,
};
