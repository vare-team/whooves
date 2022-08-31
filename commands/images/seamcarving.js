import SeamCarver from '../../utils/seamcarver.js'

//TODO: Seamcarver

export const help = {
	name: 'seamcarving',
	description: 'Сжатие изображения без потери полезных данных',
};

export const command = {
	name: help.name,
	description: help.description,
	options: [
		{
			name: 'пользователь',
			description: 'пользователь',
			type: 6,
		},
	],
};

export async function run (interaction) {
	let use = interaction.options.getUser('пользователь') || interaction.user;
	use = use.displayAvatarURL({ format: 'png', dynamic: false, size: 256 });

	await interaction.deferReply();

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
		await doIterate();
	}

	drawRotated(90);

	seamCarver = new SeamCarver(canvas);

	for (let i = 0; i < ava.height / 3; i++) {
		await doIterate();
	}

	await drawRotated(-90);

	const file = new client.userLib.discord.MessageAttachment(canvas.toBuffer(), 'img.jpg');
	const embed = new client.userLib.discord.MessageEmbed()
		.setImage('attachment://img.jpg')
		.setColor(client.userLib.colors.inf);

	interaction.editReply({ embeds: [embed], files: [file] });
}
