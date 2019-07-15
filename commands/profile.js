const { registerFont, createCanvas, loadImage, Image } = require('canvas')
const canvas = createCanvas(400, 600)
const ctx = canvas.getContext('2d')
registerFont('/home/pi/Bots/Akin/ds_moster.ttf', { family: 'Comic Sans' })
var moment = require('moment');
moment.locale('ru');

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
}

exports.run = (client, msg, args, Discord) => {

	let memb = msg.mentions.members.first()
	let use = msg.mentions.users.first()

	if (!memb) {
		memb = msg.member;
		use = msg.author
	}

	loadImage('/home/pi/Bots/Akin/images/bg.png').then((bg) => {
		msg.channel.startTyping();
		ctx.drawImage(bg, 0, 0);
		applyText(use.username, 159, 193, 25, 238)
		applyText(use.discriminator, 159, 257, 25, 238)
		applyText(`Дело №${use.id}`, 8, 110, 26, 385, true)
		let temp = 'Отрицательно';
		if (use.bot) temp = 'Положительно';
		applyText(moment(use.createdAt, "WWW MMM DD YYYY hh:mm:ss").format('Do MMMM, YYYYг.'), 22, 349, 18, 385)
		applyText(moment(memb.joinedAt, "WWW MMM DD YYYY hh:mm:ss").format('Do MMMM, YYYYг.'), 22, 423, 18, 385)
		applyText(temp, 22, 500, 18, 385)
		if (!use.avatarURL) {const attachment = canvas.toBuffer();return msg.channel.send('Фото-карточка готова!',{ files: [{ attachment, name: `profile_${use.tag}.png` }] });}
		loadImage(use.avatarURL).then((ava) => {
			ctx.drawImage(ava, 20, 139, 131, 131);
			loadImage('/home/pi/Bots/Akin/images/up.png').then((up) => {
				ctx.drawImage(up, 0, 0);
				const attachment = canvas.toBuffer();
				msg.channel.send('Фото-карточка готова!',{ files: [{ attachment, name: `profile_${use.tag}.png` }] });
				msg.channel.stopTyping();
		})
		})
	})

}; 