exports.help = {
	name: 'color',
	description: 'Конвертор 16-ричного цвета',
};

exports.command = {
	name: exports.help.name,
	description: exports.help.description,
	options: [
		{
			name: 'цвет',
			description: 'Цвет в шестнадцатиричном формате (#FFFFFF)',
			type: 3,
			required: true,
		},
	],
};

exports.run = async (client, interaction) => {
	let color = interaction.options.getString('цвет').match(/(#|)[0-9A-Fa-f]{6}/g);

	if (color === null) {
		client.userLib.retError(interaction, 'Вы указали некорректный цвет!');
		return;
	}

	color = color[0].replace('#', '');

	const rgb = hexToRgb(color),
		cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b),
		hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

	let embed = new client.userLib.discord.MessageEmbed()
		.setColor(color)
		.setTitle(`Цвет #${color.toUpperCase()}`)
		.setDescription(`Контрастный цвет: \`\`${contrastYiq(rgb.r, rgb.g, rgb.b) ? 'Белый' : 'Чёрный'}\`\``)
		.addField('RGB:', `\`\`\`Red:   ${rgb.r}\nGreen: ${rgb.g}\nBlue:  ${rgb.b}\n\`\`\`\`\`\`\nrgb(${rgb.r}, ${rgb.g}, ${rgb.b})\`\`\``, true)
		.addField('HSL:', `\`\`\`Hue:        ${hsl.h}\nSaturation: ${hsl.s}%\nLightness:  ${hsl.l}%\n\`\`\`\`\`\`\nhsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)\`\`\``, true)
		.addField('CMYK:', `\`\`\`Cyan:    ${cmyk.c}%\nMagenta: ${cmyk.m}%\nYellow:  ${cmyk.y}%\nBlack:   ${cmyk.k}%\n\`\`\``, false)
		.setImage(`https://singlecolorimage.com/get/${color}/280x80`)

	client.userLib.replyInteraction(interaction, embed);
};

function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

function rgbToCmyk (r, g, b) {
	let computedC = 0,
		computedM = 0,
		computedY = 0,
		computedK = 0;

	if (!r && !g && !b) {
		return {c: 0,m: 0,y: 0,k: 100};
	}

	computedC = 1 - (r/255);
	computedM = 1 - (g/255);
	computedY = 1 - (b/255);

	let minCMY = Math.min(computedC, Math.min(computedM,computedY));
	computedC = Math.round((computedC - minCMY) / (1 - minCMY) * 100) ;
	computedM = Math.round((computedM - minCMY) / (1 - minCMY) * 100) ;
	computedY = Math.round((computedY - minCMY) / (1 - minCMY) * 100 );
	computedK = Math.round(minCMY * 100);

	return {c: computedC,m: computedM,y: computedY,k: computedK};
}

function contrastYiq(r, g, b) {
	const yiq = (r * 299 + g * 587 + b * 114) / 1000;
	return yiq >= 128 ? 0 : 1;
}

function rgbToHsl(r, g, b) {
	r /= 255;
	g /= 255;
	b /= 255;

	let cmin = Math.min(r,g,b),
		cmax = Math.max(r,g,b),
		delta = cmax - cmin,
		h = 0,
		s = 0,
		l = 0;

	if (!delta) h = 0;
	else if (cmax === r) h = ((g - b) / delta) % 6;
	else if (cmax === g) h = (b - r) / delta + 2;
	else h = (r - g) / delta + 4;

	h = Math.round(h * 60);

	if (h < 0) h += 360;
	l = (cmax + cmin) / 2;

	s = !delta ? 0 : delta / (1 - Math.abs(2 * l - 1));

	s = +(s * 100).toFixed(1);
	l = +(l * 100).toFixed(1);

	return { h: Math.round(h), s: Math.round(s), l: Math.round(l) };
}
