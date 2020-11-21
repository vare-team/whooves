exports.help = {
	name: "petpet",
	description: "Погладить что-нибудь.\n\n*Основано на [PetPet Generator](https://benisland.neocities.org/petpet/)*",
	aliases: ['pet', 'pat'],
	usage: [{type: 'user', opt: 1}, {type: 'attach', opt: 1}],
	dm: 1,
	tier: 0,
	cooldown: 10
};

exports.run = async (client, msg, args) => {

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

	const hand = await client.userLib.loadImage('./images/hand.png');

	let gif = new GifEncoder(256, 256, {
		highWaterMark: 8 * 1024 * 1024
	});

	gif.setFrameRate(16);
	gif.setQuality(20);
	gif.setRepeat(0);
	gif.setTransparent(0x000000);

	let file = require('fs').createWriteStream('img.gif');
	gif.pipe(file);

	gif.writeHeader();

	for (let frame = 0; frame < 5; frame++) {
		ctx.clearRect(0,0,canvas.width,canvas.height);

		switch (frame) {
			case 0:
				ctx.drawImage(ava, 41, 50, 207, 213)
				break;
			case 1:
				ctx.drawImage(ava, 37, 77, 213, 189)
				break;
			case 2:
				ctx.drawImage(ava, 33, 97, 229, 171)
				break;
			case 3:
				ctx.drawImage(ava, 33, 85, 212, 177)
				break;
			case 4:
				ctx.drawImage(ava, 38, 48, 201, 216)
				break;
		}
		ctx.drawImage(hand, 112 * frame, 0, 111, 112, 0, 0, canvas.width, canvas.height);

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