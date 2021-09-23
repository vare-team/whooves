exports.help = {
	name: 'Бегущая строка',
	description: 'Переводит текст сообщения в бегущую строку.',
};

exports.command = {
	name: exports.help.name,
	type: 3,
};

const GifEncoder = require('gif-encoder');

exports.run = async (client, interaction) => {
	await interaction.deferReply();

	const canvas = client.userLib.createCanvas(856, 128),
		ctx = canvas.getContext('2d'),
		gif = new GifEncoder(canvas.width, canvas.height, { highWaterMark: 8 * 1024 * 1024 }),
		text = interaction.options.getMessage('message').cleanContent;

	ctx.font = '100px sans-serif';
	ctx.fillStyle = '#FFFFFF';

	gif.setFrameRate(8);
	gif.setQuality(20);
	gif.setRepeat(0);
	gif.setTransparent(0x000000);


	gif.writeHeader();

	for (let i = 1; i < (canvas.width + ctx.measureText(text).width) / 50; i++) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		// ctx.fillText(i, 0, 64)
		ctx.fillText(text, canvas.width - 50 * i, canvas.height / 2 + 25);
		gif.addFrame(ctx.getImageData(0, 0, canvas.width, canvas.height).data);
	}

	gif.finish();

	const file = new client.userLib.discord.MessageAttachment(gif.read(), 'img.gif');
	let embed = new client.userLib.discord.MessageEmbed()
		.setImage('attachment://img.gif')
		.setColor(client.userLib.colors.inf);
	interaction.editReply({ embeds: [embed], files: [file] });
};
