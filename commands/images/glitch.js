exports.help = {
	name: 'glitch',
	description: 'Глитч эффект.',
	dm: 1,
	tier: 0,
	cooldown: 10,
};

exports.command = {
	name: exports.help.name,
	description: exports.help.description,
	options: [
		{
			name: 'пользователь',
			description: 'пользователь',
			type: 6,
		},
		{
			name: 'качество',
			description: 'Разрашение аватарки',
			type: 4,
			choices: [
				{
					name: '64x64',
					value: 64,
				},
				{
					name: '128x128',
					value: 128,
				},
				{
					name: '256x256',
					value: 256,
				},
				{
					name: '512x512',
					value: 512,
				},
			],
		},
	],
};

const GifEncoder = require('gif-encoder');
const { createWriteStream } = require('fs');

function randomInteger(min, max) {
	return Math.round(min - 0.5 + Math.random() * (max - min + 1));
}

exports.run = async (client, interaction) => {
	let use = interaction.options.getUser('пользователь') || interaction.user;
	let size = interaction.options.getInteger('качество') ? interaction.options.getInteger('качество') : 128;
	use = use.displayAvatarURL({ format: 'png', dynamic: false, size: size });

	await interaction.defer();

	const ava = await client.userLib.loadImage(use),
		canvas = client.userLib.createCanvas(size, size),
		ctx = canvas.getContext('2d');
	let gif = new GifEncoder(size, size, { highWaterMark: 8 * 1024 * 1024 });

	gif.setFrameRate(24);
	gif.setQuality(30);
	gif.setRepeat(0);
	gif.setTransparent(0x000000);

	gif.pipe(createWriteStream('img.gif'));

	gif.writeHeader();

	ctx.drawImage(ava, 0, 0, size, size);

	for (let frame = 1; frame < 37; frame++) {
		ctx.drawImage(
			ava,
			randomInteger(-15, 15),
			randomInteger(-15, 15),
			randomInteger(size - size / 1.8, size + size * 1.3),
			randomInteger(size - size / 1.8, size + size * 1.3)
		);

		let glitch = ctx.getImageData(
			randomInteger(1, size - 1),
			randomInteger(1, size - 1),
			randomInteger(1, size - 1),
			randomInteger(1, size - 1)
		);
		for (let i = 0; i < glitch.data.length; i += 4) {
			glitch.data[i] = 255 - glitch.data[i];
			glitch.data[i + 1] = 255 - glitch.data[i + 1];
			glitch.data[i + 2] = 255 - glitch.data[i + 2];
		}
		ctx.putImageData(glitch, randomInteger(1, size - size / 1.5), randomInteger(1, size - size / 1.6));

		glitch = ctx.getImageData(
			randomInteger(1, size - 1),
			randomInteger(1, size - 1),
			randomInteger(1, size - 1),
			randomInteger(1, size - 1)
		);
		for (let i = 0; i < glitch.data.length; i += 4) {
			glitch.data[i] = glitch.data[i] * 3.59 + -331.52;
			glitch.data[i + 1] = glitch.data[i + 1] * 3.59 + -331.52;
			glitch.data[i + 2] = glitch.data[i + 2] * 3.59 + -331.52;
		}
		ctx.putImageData(glitch, randomInteger(1, size - size / 1.4), randomInteger(1, size - size / 1.8));

		glitch = ctx.getImageData(
			randomInteger(1, size - 1),
			randomInteger(1, size - 1),
			randomInteger(1, size - 1),
			randomInteger(1, size - 1)
		);
		ctx.putImageData(glitch, randomInteger(1, size - size / 1.3), randomInteger(1, size - size / 2));

		gif.addFrame(ctx.getImageData(0, 0, canvas.width, canvas.height).data);
	}

	gif.finish();

	gif.on('end', () => {
		const file = new client.userLib.discord.MessageAttachment('img.gif');
		let embed = new client.userLib.discord.MessageEmbed()
			.setImage('attachment://img.gif')
			.setColor(client.userLib.colors.inf);
		interaction.editReply({ embeds: [embed], files: [file] });
	});
};
