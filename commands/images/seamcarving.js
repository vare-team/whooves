exports.help = {
	name: 'seamcarving',
	description: 'Seam carving.',
	aliases: ['sc'],
	usage: [
		{ type: 'user', opt: 1 },
		{ type: 'attach', opt: 1 },
	],
	dm: 1,
	tier: 0,
	cooldown: 10,
	hide: 1,
};

let SeamCarver = require('../../utils/seamcarver');

exports.run = async (client, msg) => {
	if (msg.attachments.first() && !msg.attachments.first().width) {
		client.userLib.retError(msg, 'Файл должен быть изображением.');
		return;
	}

	if (msg.attachments.first() && (msg.attachments.first().width > 512 || msg.attachments.first().height > 512)) {
		client.userLib.retError(msg, 'Максиальныо допустимые размеры изображения 512x512!');
		return;
	}

	if (msg.attachments.first() && msg.attachments.first().size > 8 * 1024 * 1024) {
		client.userLib.retError(msg, 'Файл слишком большой. Он должен быть меньше 8 Мбайт.');
		return;
	}

	let use = msg.magicMention.user || msg.author;
	use = msg.attachments.first()
		? msg.attachments.first().url
		: use.displayAvatarURL({ format: 'png', dynamic: false, size: 512 });

	let currentSeam = [],
		ava = await client.userLib.loadImage(use);
	const canvas = client.userLib.createCanvas(ava.width, ava.height),
		ctx = canvas.getContext('2d'),
		config = { field: 'rgb' };
	ctx.drawImage(ava, 0, 0, canvas.width, canvas.height);

	let seamCarver = new SeamCarver(canvas);
	seamCarver.reDrawImage(config);

	function findSeam() {
		currentSeam = seamCarver.findVerticalSeam();
		return currentSeam;
	}

	function drawRotated(degrees) {
		const hiddenCanvas = client.userLib.createCanvas(canvas.height, canvas.width),
			hiddenCtx = hiddenCanvas.getContext('2d');

		hiddenCtx.save();
		hiddenCtx.translate(canvas.height / 2, canvas.width / 2);
		hiddenCtx.rotate(-degrees * (Math.PI / 180));
		hiddenCtx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
		hiddenCtx.restore();

		canvas.width = hiddenCanvas.width;
		canvas.height = hiddenCanvas.height;
		ctx.drawImage(hiddenCanvas, 0, 0, hiddenCanvas.width, hiddenCanvas.height);
	}

	function removeSeam() {
		seamCarver.removeVerticalSeam(currentSeam);
		seamCarver.reDrawImage(config);
		currentSeam = [];
	}

	function doIterate() {
		findSeam();
		removeSeam();
		seamCarver.reDrawImage(config);
	}

	for (let i = 0; i < ava.width / 3; i++) {
		doIterate();
	}

	drawRotated(90);

	seamCarver = new SeamCarver(canvas);

	for (let i = 0; i < ava.height / 3; i++) {
		doIterate();
	}

	await drawRotated(-90);

	let embed = new client.userLib.discord.MessageEmbed()
		.attachFiles({
			attachment: canvas.toBuffer(),
			name: `img.jpg`,
		})
		.setImage('attachment://img.jpg')
		.setColor(client.userLib.colors.inf)
		.setFooter(msg.author.tag, msg.author.displayAvatarURL());

	msg.channel.send(embed);
};
