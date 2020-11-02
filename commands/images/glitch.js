exports.help = {
	name: "glitch",
	description: "Глитч эффект.",
	aliases: [],
	usage: [{type: 'user', opt: 1}, {type: 'attach', opt: 1}, {type: 'text', opt: 1, name: 'left/right'}],
	dm: 1,
	tier: 0,
	cooldown: 10
};

function randomInteger(min, max) {
	// получить случайное число от (min-0.5) до (max+0.5)
	let rand = min - 0.5 + Math.random() * (max - min + 1);
	return Math.round(rand);
}

exports.run = async (client, msg, args) => {

	let direction = args[args.length-1] === 'left' ? -10 : 10;

	if (msg.attachments.first() && !msg.attachments.first().width) {
		client.userLib.retError(msg, 'Файл должен быть изображением.');
		return;
	}

	if (msg.attachments.first() && msg.attachments.first().size > 8*1024*1024) {
		client.userLib.retError(msg, 'Файл слишком большой. Он должен быть меньше 8 Мбайт.');
		return;
	}

	let use = msg.magicMention.user || msg.author;
	use = msg.attachments.first() ? msg.attachments.first().url : use.displayAvatarURL({format: 'jpg', dynamic: false, size: 256});

	const ava = await client.userLib.loadImage(use)
		, canvas = client.userLib.createCanvas(256, 256)
		, ctx = canvas.getContext('2d')
		, GifEncoder = require('gif-encoder');

	let gif = new GifEncoder(256, 256, {
		highWaterMark: 8 * 1024 * 1024
	});

	gif.setFrameRate(24);
	gif.setQuality(30);
	gif.setRepeat(0);
	gif.setTransparent(0x000000);

	let file = require('fs').createWriteStream('img.gif');
	gif.pipe(file);

	gif.writeHeader();

	ctx.drawImage(ava, 0, 0, canvas.width, canvas.height);

	for (let frame = 1; frame < 37; frame++) {
		ctx.drawImage(ava, randomInteger(-15,15), randomInteger(-15,15), randomInteger(240,270), randomInteger(240,270));

		let glitch = ctx.getImageData(randomInteger(1,255), randomInteger(1,255), randomInteger(1,255), randomInteger(1,255));
		for (let i = 0; i < glitch.data.length; i += 4) {
			glitch.data[i] = 255 - glitch.data[i];
			glitch.data[i + 1] = 255 - glitch.data[i + 1];
			glitch.data[i + 2] = 255 - glitch.data[i + 2];
		}
		ctx.putImageData(glitch, randomInteger(1,150), randomInteger(1,150));


		glitch = ctx.getImageData(randomInteger(1,255), randomInteger(1,255), randomInteger(1,255), randomInteger(1,255));
		for (let i = 0; i < glitch.data.length; i += 4) {
			glitch.data[i] = (glitch.data[i] * 3.59) + -331.52;
			glitch.data[i + 1] = (glitch.data[i + 1] * 3.59) + -331.52;
			glitch.data[i + 2] = (glitch.data[i + 2] * 3.59) + -331.52;
		}
		ctx.putImageData(glitch, randomInteger(1,150), randomInteger(1,150));


		glitch = ctx.getImageData(randomInteger(1,255), randomInteger(1,255), randomInteger(1,255), randomInteger(1,255));
		ctx.putImageData(glitch, randomInteger(1,150), randomInteger(1,150));

		gif.addFrame(ctx.getImageData(0, 0, canvas.width, canvas.height).data);
	}

	gif.finish();

	gif.on('end', () => {
		let embed = new client.userLib.discord.MessageEmbed()
			.attachFiles({
				attachment: 'img.gif',
				name: `img.gif`
			})
			.setImage('attachment://img.gif')
			.setColor(client.userLib.colors.inf)
			.setFooter(msg.author.tag, msg.author.displayAvatarURL());

		msg.channel.send(embed);
	});
};