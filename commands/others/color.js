exports.help = {
	name: 'color',
	description: 'Ифнормация о цвете',
	usage: [{ type: 'text', opt: 0, name: '#HEX' }],
	dm: 1,
	tier: 0,
	cooldown: 5,
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
	let embed = new client.userLib.discord.MessageEmbed();

	if (!/(#|)[0-9A-Fa-f]{6}/g.test(interaction.data.options['цвет'].value)) {
		client.userLib.retError(interaction, 'Вы указали некорректный цвет!');
		return;
	}

	let color = parseInt(interaction.data.options['цвет'].value.replace('#', ''), 16);

	if (!color || 16777215 < color || 0 > color) {
		client.userLib.retError(interaction, 'Вы указали некорректный цвет!');
		return;
	}

	let body = await client.userLib.request(
		'https://www.thecolorapi.com/id?hex=' + interaction.data.options['цвет'].value.replace('#', ''),
		{
			json: true,
		}
	);

	if (!body || !body.name || !body.name.value) return client.userLib.retError(interaction, 'Ошибка API.');
	if (body.code === 400) return client.userLib.retError(interaction, 'Ошибка распознования цвета.');

	embed
		.setColor(color)
		.setTitle('Цвет ' + body.name.value)
		.addField('RGB', `Red: **${body.rgb.r}**\nGreen: **${body.rgb.g}**\nBlued: **${body.rgb.b}**\n`, true)
		.addField('HSV', `Hue: **${body.hsv.h}**\nSaturation: **${body.hsv.s}**\nValue: **${body.hsv.v}**\n`, true)
		.addField('HSL', `Hue: **${body.hsl.h}**\nSaturation: **${body.hsl.s}**\nLightness: **${body.hsl.l}**\n`, true)
		.addField(
			'CMYK',
			`Cyan: **${body.cmyk.c}**\nMagenta: **${body.cmyk.m}**\nYellow: **${body.cmyk.y}**\nBlack: **${body.cmyk.k}**\n`,
			true
		)
		.addField('Util', `${body.rgb.value}\n${body.hsv.value}\n${body.hsl.value}\n${body.cmyk.value}`, true);

	client.userLib.replyInteraction(interaction, embed);
};
