exports.help = {
	name: "profile",
	description: "Сгенерировать профиль-карточку.",
	aliases: ['pr'],
	usage: [{type: 'user', opt: 1}],
	dm: 0,
	tier: 0,
	cooldown: 10,
	hide: 1
};

const applyText = (canvas, ctx, text = '', x = 0, y = 0, fontSize = 18, width = 0, flag = false) => {
    do {
        ctx.font = `${fontSize -= 1}px "Comic Sans"`;
    } while (ctx.measureText(text).width > width);
    if (flag) x = canvas.width / 2 - (ctx.measureText(text).width / 2);
    ctx.fillText(text, x, y)
};

exports.run = async (client, msg) => {
	msg.channel.startTyping();

	let use = msg.magicMention.user || msg.author;

	const canvas = client.userLib.createCanvas(400, 600);
	const ctx = canvas.getContext('2d');

	ctx.drawImage(await client.userLib.loadImage('./images/bg.png'), 0, 0);
	applyText(canvas, ctx, use.username, 159, 193, 25, 238);
	applyText(canvas, ctx, use.discriminator, 159, 257, 25, 238);
	applyText(canvas, ctx, `Дело №${use.id}`, 8, 110, 26, 385, true);
	applyText(canvas, ctx, client.userLib.moment(use.createdAt, "WWW MMM DD YYYY hh:mm:ss").format('Do MMMM, YYYYг.'), 22, 349, 18, 385);
	applyText(canvas, ctx, client.userLib.moment(msg.guild.members.cache.get(use.id).joinedAt, "WWW MMM DD YYYY hh:mm:ss").format('Do MMMM, YYYYг.'), 22, 423, 18, 385);
	applyText(canvas, ctx, use.bot ? 'Положительно' : 'Отрицательно', 22, 500, 18, 385);

	if (use.displayAvatarURL()) {
		ctx.drawImage(await client.userLib.loadImage(use.displayAvatarURL()), 20, 139, 131, 131);
		ctx.drawImage(await client.userLib.loadImage('./images/up.png'), 0, 0);
	}

	await msg.channel.send('Фото-карточка готова!', {files: [{attachment: canvas.toBuffer(), name: `profile_${use.tag}.png`}]});
	msg.channel.stopTyping();
}; 