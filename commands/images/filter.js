exports.help = {
	name: 'filter',
	description: 'Применить фильтр к аватарке',
	dm: 1,
	tier: 0,
	cooldown: 10,
};

exports.command = {
	name: exports.help.name,
	description: exports.help.description,
	options: [
		{
			name: 'фильтр',
			description: 'Фильтр для обработки',
			type: 3,
			required: true,
			choices: [
				{
					name: 'Инверсия',
					value: 'invert',
				},
				{
					name: 'Чёрно-белое',
					value: 'bw',
				},
				{
					name: 'Сепия',
					value: 'sepia',
				},
				{
					name: 'Повышенный контраст',
					value: 'contrast',
				},
				{
					name: 'Искажения',
					value: 'distortion',
				},
				{
					name: 'Глитч',
					value: 'glitch',
				},
			],
		},
		{
			name: 'пользователь',
			description: 'Выбрать аватар пользователя',
			type: 6,
		},
	],
};

String.prototype.replaceAt = function (index, replacement) {
	return this.substr(0, index) + replacement + this.substr(index + replacement.length);
};

exports.run = async (client, interaction) => {
	let use = interaction.options.getUser('пользователь') || interaction.user;
	use = use.displayAvatarURL({ format: 'png', dynamic: false, size: 512 });
	await interaction.deferReply();
	const ava = await client.userLib.loadImage(use),
		canvas = client.userLib.createCanvas(ava.width, ava.height),
		ctx = canvas.getContext('2d');
	ctx.drawImage(ava, 0, 0, ava.width, ava.height);

	switch (interaction.options.getString('фильтр')) {
		case 'invert':
			invert(ctx, 0, 0, ava.width, ava.height);
			break;
		case 'bw':
			greyscale(ctx, 0, 0, ava.width, ava.height);
			break;
		case 'sepia':
			sepia(ctx, 0, 0, ava.width, ava.height);
			break;
		case 'contrast':
			contrast(ctx, 0, 0, ava.width, ava.height);
			break;
		case 'distortion':
			distort(ctx, 0, 0, ava.width, ava.height);
			break;
		case 'glitch':
			ava.src = canvas.toDataURL('image/jpeg');
			for (let i = 0; i < 5; i++)
				ava.src = ava.src.replaceAt(client.userLib.randomIntInc(50, ava.src.length - 50), '0');
			try {
				ctx.drawImage(ava, 0, 0);
			} catch (e) {
				client.userLib.retError(
					interaction,
					'При компиляции файл был повреждён слишком сильно.\nПопробуйте снова через время.'
				);
				return;
			}
			break;
	}

	const file = new client.userLib.discord.MessageAttachment(canvas.toBuffer(), 'filter.jpeg');
	let embed = new client.userLib.discord.MessageEmbed()
		.setImage('attachment://filter.jpeg')
		.setColor(client.userLib.colors.inf)
		.setDescription('Фильтр: ' + interaction.options.getString('фильтр'));

	interaction.editReply({ embeds: [embed], files: [file] });
};

function greyscale(ctx, x, y, width, height) {
	const data = ctx.getImageData(x, y, width, height);
	for (let i = 0; i < data.data.length; i += 4) {
		const brightness = 0.34 * data.data[i] + 0.5 * data.data[i + 1] + 0.16 * data.data[i + 2];
		data.data[i] = brightness;
		data.data[i + 1] = brightness;
		data.data[i + 2] = brightness;
	}
	ctx.putImageData(data, x, y);
	return ctx;
}
function invert(ctx, x, y, width, height) {
	const data = ctx.getImageData(x, y, width, height);
	for (let i = 0; i < data.data.length; i += 4) {
		data.data[i] = 255 - data.data[i];
		data.data[i + 1] = 255 - data.data[i + 1];
		data.data[i + 2] = 255 - data.data[i + 2];
	}
	ctx.putImageData(data, x, y);
	return ctx;
}
function sepia(ctx, x, y, width, height) {
	const data = ctx.getImageData(x, y, width, height);
	for (let i = 0; i < data.data.length; i += 4) {
		const brightness = 0.34 * data.data[i] + 0.5 * data.data[i + 1] + 0.16 * data.data[i + 2];
		data.data[i] = brightness + 100;
		data.data[i + 1] = brightness + 50;
		data.data[i + 2] = brightness;
	}
	ctx.putImageData(data, x, y);
	return ctx;
}
function contrast(ctx, x, y, width, height) {
	const data = ctx.getImageData(x, y, width, height);
	const factor = 259 / 100 + 1;
	const intercept = 128 * (1 - factor);
	for (let i = 0; i < data.data.length; i += 4) {
		data.data[i] = data.data[i] * factor + intercept;
		data.data[i + 1] = data.data[i + 1] * factor + intercept;
		data.data[i + 2] = data.data[i + 2] * factor + intercept;
	}
	ctx.putImageData(data, x, y);
	return ctx;
}
function distort(ctx, x = 0, y = 0, width = 0, height = 0, amplitude = 60, strideLevel = 4) {
	const data = ctx.getImageData(x, y, width, height);
	const temp = ctx.getImageData(x, y, width, height);
	const stride = width * strideLevel;
	for (let i = 0; i < width; i++) {
		for (let j = 0; j < height; j++) {
			const xs = Math.round(amplitude * Math.sin(2 * Math.PI * 3 * (j / height)));
			const ys = Math.round(amplitude * Math.cos(2 * Math.PI * 3 * (i / width)));
			const dest = j * stride + i * strideLevel;
			const src = (j + ys) * stride + (i + xs) * strideLevel;
			data.data[dest] = temp.data[src];
			data.data[dest + 1] = temp.data[src + 1];
			data.data[dest + 2] = temp.data[src + 2];
		}
	}
	ctx.putImageData(data, x, y);
	return ctx;
}
