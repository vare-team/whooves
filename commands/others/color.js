exports.help = {
	name: 'color',
	description: 'Ифнормация о цвете',
	aliases: ['colour'],
	usage: [{ type: 'text', opt: 0, name: '#HEX' }],
	dm: 1,
	tier: 0,
	cooldown: 5,
};

exports.run = async (client, msg, args) => {
	let embed = new client.userLib.discord.MessageEmbed();

	if (!/(#|)[0-9A-Fa-f]{6}/g.test(args[0])) {
		client.userLib.retError(msg, 'Вы указали некорректный цвет!');
		return;
	}

	let color = parseInt(args[0].replace('#', ''), 16);

	if (!color || 16777215 < color || 0 > color) {
		client.userLib.retError(msg, 'Вы указали некорректный цвет!');
		return;
	}

	let body = await client.userLib.request('https://www.thecolorapi.com/id?hex=' + args[0], { json: true });

	if (!body) return client.userLib.retError(msg, 'Ошибка API.');

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
		.addField('Util', `${body.rgb.value}\n${body.hsv.value}\n${body.hsl.value}\n${body.cmyk.value}`, true)
		.setFooter(msg.author.tag, msg.author.displayAvatarURL());
	msg.channel.send(embed);
};
