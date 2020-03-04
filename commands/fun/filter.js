exports.help = {
  name: "filter",
  description: "Применить фильтр\n\`\`1 - Инверсия\n2 - Чёрно-белое\n3 - Сепия\n4 - Контраст\n5 - Искажение\n6 - Глитч Эффект\n7 - Харчок?\`\`",
	aliases: ['f'],
  usage: [{type: 'text', opt: 0, name: '1-7'},
	        {type: 'user', opt: 1},
	        {type: 'attach', opt: 1}],
	dm: 0,
	tier: 0,
  cooldown: 10
};

String.prototype.replaceAt = function(index, replacement) {
	return this.substr(0, index) + replacement + this.substr(index + replacement.length);
};

exports.run = async (client, msg, args) => {
	if (['1','2','3','4','5','6','7', '8'].indexOf(args[0]) == -1) {
		client.userLib.retError(msg, 'Неправильно указан номер фильтра.\n' + client.userLib.generateUsage(exports.help.usage));
		return;
	}

	if (msg.attachments.first() && !msg.attachments.first().width) {
		client.userLib.retError(msg, 'Файл должен быть изображением.');
		return;
	}

	if (msg.attachments.first() && msg.attachments.first().size > 8*1024*1024) {
		client.userLib.retError(msg, 'Файл слишком большой. Он должен быть меньше 8 Мбайт.');
		return;
	}

	let use = msg.magicMention.user || msg.author;
	use = msg.attachments.first() ? msg.attachments.first().url : use.displayAvatarURL({format: 'png', dynamic: false, size: 512});

	const ava = await client.userLib.loadImage(use)
			, canvas = client.userLib.createCanvas(ava.width, ava.height)
			, ctx = canvas.getContext('2d');
	ctx.drawImage(ava, 0, 0, ava.width, ava.height);

	switch (args[0]) {
		case '1':
			invert(ctx, 0, 0, ava.width, ava.height);
			break;
		case '2':
			greyscale(ctx, 0, 0, ava.width, ava.height);
			break;
		case '3':
			sepia(ctx, 0, 0, ava.width, ava.height);
			break;
		case '4':
			contrast(ctx, 0, 0, ava.width, ava.height);
			break;
		case '5':
			distort(ctx, 0, 0, ava.width, ava.height);
			break;
		case '6':
			ava.src = canvas.toDataURL("image/jpeg");
			for (let i = 0; i < 5; i++) {
				ava.src = ava.src.replaceAt(client.userLib.randomIntInc(50, ava.src.length - 50), "0");
			}
			try {
				ctx.drawImage(ava,0,0);
			} catch (e) {
				client.userLib.retError(msg,'При компиляции файл был повреждён слишком сильно.\nПопробуйте снова через время.');
				return;
			}
			break;
		case '7':
			greyscale(ctx, 0, 0, ava.width, ava.height);
			ctx.drawImage(await client.userLib.loadImage('./images/plevok.png'), 0, 0, ava.width, ava.height);
			break;
	}

	let embed = new client.userLib.discord.MessageEmbed()
		.attachFiles({
			attachment: canvas.toBuffer(),
			name: `filter.jpeg`
		})
		.setImage('attachment://filter.jpeg')
		.setColor(client.userLib.colors.inf)
		.setTitle('Фильтр: ' + args[0])
		.setFooter(msg.author.tag, msg.author.displayAvatarURL());

	msg.channel.send(embed)
};


function greyscale(ctx, x, y, width, height) {
	const data = ctx.getImageData(x, y, width, height);
	for (let i = 0; i < data.data.length; i += 4) {
		const brightness = (0.34 * data.data[i]) + (0.5 * data.data[i + 1]) + (0.16 * data.data[i + 2]);
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
		const brightness = (0.34 * data.data[i]) + (0.5 * data.data[i + 1]) + (0.16 * data.data[i + 2]);
		data.data[i] = brightness + 100;
		data.data[i + 1] = brightness + 50;
		data.data[i + 2] = brightness;
	}
	ctx.putImageData(data, x, y);
	return ctx;
}
function contrast(ctx, x, y, width, height) {
	const data = ctx.getImageData(x, y, width, height);
	const factor = (259 / 100) + 1;
	const intercept = 128 * (1 - factor);
	for (let i = 0; i < data.data.length; i += 4) {
		data.data[i] = (data.data[i] * factor) + intercept;
		data.data[i + 1] = (data.data[i + 1] * factor) + intercept;
		data.data[i + 2] = (data.data[i + 2] * factor) + intercept;
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
			const dest = (j * stride) + (i * strideLevel);
			const src = ((j + ys) * stride) + ((i + xs) * strideLevel);
			data.data[dest] = temp.data[src];
			data.data[dest + 1] = temp.data[src + 1];
			data.data[dest + 2] = temp.data[src + 2];
		}
	}
	ctx.putImageData(data, x, y);
	return ctx;
}