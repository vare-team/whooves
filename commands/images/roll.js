exports.help = {
	name: 'roll',
	description: 'Кручения изображения на 360.',
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
			name: 'направление',
			description: 'Направление вращение',
			type: 3,
			choices: [
				{
					name: 'Вправо',
					value: 'right',
				},
				{
					name: 'Влево',
					value: 'left',
				},
			],
		},
	],
};

const GifEncoder = require('gif-encoder');
const { createWriteStream } = require('fs');

exports.run = async (client, interaction) => {
	let use = interaction.options.getUser('пользователь') || interaction.user;
	use = use.displayAvatarURL({ format: 'png', dynamic: false, size: 256 });
	await interaction.deferReply();

	const ava = await client.userLib.loadImage(use),
		canvas = client.userLib.createCanvas(256, 256),
		ctx = canvas.getContext('2d');
	const gif = new GifEncoder(256, 256, { highWaterMark: 8 * 1024 * 1024 });
	gif.setFrameRate(24);
	gif.setQuality(20);
	gif.setRepeat(0);
	gif.setTransparent(0x000000);

	gif.pipe(createWriteStream('img.gif'));

	gif.writeHeader();

	for (let frame = 1; frame < 37; frame++) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.save();
		ctx.translate(canvas.width / 2, canvas.height / 2);
		ctx.rotate((frame * (interaction.options.getString('направление') === 'left' ? -10 : 10) * Math.PI) / 180);
		ctx.drawImage(ava, -canvas.width / 2, -canvas.width / 2, 256, 256);
		ctx.globalCompositeOperation = 'destination-in';
		ctx.beginPath();
		ctx.arc(0, 0, canvas.width / 2, 0, Math.PI * 2);
		ctx.closePath();
		ctx.fill();
		ctx.restore();

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
