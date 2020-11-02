exports.help = {
	name: "roll",
	description: "Кручения изображения на 360.",
	aliases: [],
	usage: [{type: 'user', opt: 1}, {type: 'attach', opt: 1}, {type: 'text', opt: 1, name: 'left/right'}],
	dm: 1,
	tier: 0,
	cooldown: 10
};

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
	gif.setQuality(20);
	gif.setRepeat(0);
	gif.setTransparent(0x000000);

	let file = require('fs').createWriteStream('img.gif');
	gif.pipe(file);

	gif.writeHeader();

	function drawRotated(degrees){
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.save();
		ctx.translate(canvas.width/2,canvas.height/2);
		ctx.rotate(degrees*Math.PI/180);
		ctx.drawImage(ava,-canvas.width/2,-canvas.width/2, 256, 256);
		ctx.globalCompositeOperation='destination-in';
		ctx.beginPath();
		ctx.arc(0,0,canvas.width/2,0,Math.PI*2);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	}


  for (let frame = 1; frame < 37; frame++) {
	  drawRotated(frame * direction);
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