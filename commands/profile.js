const moment = require('moment');
const { registerFont, createCanvas, loadImage, Image } = require('canvas');
const canvas = createCanvas(400, 600);
const ctx = canvas.getContext('2d');
registerFont('./ds_moster.ttf', { family: 'Comic Sans' });

const applyText = (text, x, y, fontSize, width, flag = false) => {
    do {
        ctx.font = `${fontSize -= 1}px "Comic Sans"`;
    } while (ctx.measureText(text).width > width);
    if (flag) x = canvas.width / 2 - (ctx.measureText(text).width / 2)
    ctx.fillText(text, x, y)
};

exports.help = {
    name: "profile",
    description: "Сгенерировать профиль-карточку.",
    usage: "profile (@кто)",
    flag: 3,
    cooldown: 10000
};

exports.run = (client, msg, args, Discord) => {
	let user = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[0]));
	if(!user) {
		loadImage('./images/bg.png').then((bg) => {
			msg.channel.startTyping();
			ctx.drawImage(bg, 0, 0);
			applyText(msg.author.username, 159, 193, 25, 238)
			applyText(msg.author.discriminator, 159, 257, 25, 238)
			applyText(`Дело №${msg.author.id}`, 8, 110, 26, 385, true)
			let temp = 'Отрицательно';
			if (msg.author.bot) temp = 'Положительно';
			applyText(moment(msg.author.createdAt).locale('ru').format('DD MM, YYYYг.'), 22, 349, 18, 385)
			applyText(moment(msg.author.joinedAt).locale('ru').format('DD MM, YYYYг.'), 22, 423, 18, 385)
			applyText(temp, 22, 500, 18, 385)
			loadImage(msg.author.displayAvatarURL).then((ava) => {
				ctx.drawImage(ava, 20, 139, 131, 131);
				loadImage('./images/up.png').then((up) => {
					ctx.drawImage(up, 0, 0);
					const attachment = canvas.toBuffer();
					msg.channel.send('Фото-карточка готова!', { files: [{ attachment, name: `profile_${msg.author.tag}.png` }] });
					msg.channel.stopTyping();
				});
			});
		});
	} else {
		loadImage('./images/bg.png').then((bg) => {
			msg.channel.startTyping();
			ctx.drawImage(bg, 0, 0);
			applyText(user.user.username, 159, 193, 25, 238)
			applyText(user.user.discriminator, 159, 257, 25, 238)
			applyText(`Дело №${user.id}`, 8, 110, 26, 385, true)
			let temp = 'Отрицательно';
			if (user.user.bot) temp = 'Положительно';
			applyText(moment(user.user.createdAt).locale('ru').format('DD MM, YYYYг.'), 22, 349, 18, 385)
			applyText(moment(user.user.joinedAt).locale('ru').format('DD MM, YYYYг.'), 22, 423, 18, 385)
			applyText(temp, 22, 500, 18, 385)
			loadImage(user.user.displayAvatarURL).then((ava) => {
				ctx.drawImage(ava, 20, 139, 131, 131);
				loadImage('./images/up.png').then((up) => {
					ctx.drawImage(up, 0, 0);
					const attachment = canvas.toBuffer();
					msg.channel.send('Фото-карточка готова!', { files: [{ attachment, name: `profile_${user.user.tag}.png` }] });
					msg.channel.stopTyping();
				});
			});
		});
	}
}; 