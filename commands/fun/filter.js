const { registerFont, createCanvas, loadImage, Image } = require('canvas')
registerFont('./ds_moster.ttf', { family: 'Comic Sans' })
let attachment;

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
function silhouette(ctx, x, y, width, height) {
	const data = ctx.getImageData(x, y, width, height);
	for (let i = 0; i < data.data.length; i += 4) {
		data.data[i] = 0;
		data.data[i + 1] = 0;
		data.data[i + 2] = 0;
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
function distort(ctx, amplitude, x, y, width, height, strideLevel = 4) {
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


exports.help = {
  name: "filter",
  description: "Применить фильтр\n\`\`1 - Инверсия\n2 - Чёрно-белое\n3 - Сепия\n4 - Контраст\n5 - Искажение\n6 - Глитч Эффект\n7 - Харчок?\`\`",
	aliases: ['f'],
  usage: "[1-7] (@кто/вложение)",
	dm: 0,
	args: 1,
	tier: 0,
  cooldown: 10
};

exports.run = async (client, msg, args, Discord) => {

	let use;

	if (msg.mentions.users.first()) use = msg.mentions.users.first().avatarURL;

	if (!use && msg.author.avatarURL) use = msg.author.avatarURL;

	if (msg.attachments.first()) {
		if (!parseInt(msg.attachments.first().width)) {client.userLib.retError(msg.channel, msg.author, 'Файл должен быть изображением.'); return;}
		use = msg.attachments.first().url;}


	msg.channel.startTyping();

	let ava = await loadImage(use);
	const canvas = createCanvas(ava.width, ava.height)
	const ctx = canvas.getContext('2d')
	ctx.drawImage(ava, 0, 0, ava.width, ava.height);
	switch (args[1]) {
		case '1':
			invert(ctx, 0, 0, ava.width, ava.height);
			attachment = canvas.toBuffer();
			break;
		case '2':
			greyscale(ctx, 0, 0, ava.width, ava.height);
			attachment = canvas.toBuffer();
			break;
		case '3':
			sepia(ctx, 0, 0, ava.width, ava.height);
			attachment = canvas.toBuffer();
			break;
		case '4':
			contrast(ctx, 0, 0, ava.width, ava.height);
			attachment = canvas.toBuffer();
			break;
		case '5':
			distort(ctx, 60, 0, 0, ava.width, ava.height);
			attachment = canvas.toBuffer();
			break;
		case '6':
			contrast(ctx, 0, 0, ava.width, ava.height);
			distort(ctx, rand.int(5, 15), 0, 0, ava.width, ava.height);
			attachment = canvas.toBuffer('image/jpeg', { quality: client.userLib.randomIntInc(0, 100) });
			break;
		case '7':
			let plevok = await loadImage('/home/pi/Bots/Akin/images/plevok.png');
			greyscale(ctx, 0, 0, ava.width, ava.height);
			ctx.drawImage(plevok, 0, 0, ava.width, ava.height);
			attachment = canvas.toBuffer();
			break;
		default:
			client.userLib.retError(msg.channel, msg.author, 'Не указан номер фильтра.'); return;
	}


	msg.channel.send({ files: [{ attachment, name: `filter.jpeg` }] });
	msg.channel.stopTyping();

}; 