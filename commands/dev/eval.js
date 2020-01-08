exports.help = {
	name: "eval",
	description: "Испольнение кода",
	aliases: [],
	usage: "[JavaScript]",
	dm: 1,
	tier: 2,
	cooldown: 0
};

function clean(text) {return typeof(text) !== "string" ? text : text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);}

/**********************/
// Константы доступные в коде

const os = require('os')
	, fs = require('fs')
	, { performance } = require('perf_hooks')
	, master = '166610390581641217'
	, mega = '321705723216134154'
;

/**********************/

exports.run = async (client, msg, args) => {
	if (msg.author.id != master && msg.author.id != mega) {
		client.userLib.retError(msg.channel, msg.author, 'Что-то пошло по пизде, но 2 защита сохранила безопасность.');
		return;
	}

	/**********************/
	// Быстрые переменные из client

	let embed = new client.userLib.discord.RichEmbed();

	/**********************/

	let temp = 'В процессе.';
	let msge = await msg.channel.send(temp);
	
	try {
		const code = args.join(" ");
		if (/client *\. *token/g.test(code)) {
			temp = `**Исход: ошибка!**\n Наименование: \`\`Defend\`\` \n \n \`\`Try to catch token\`\``;
			msge.edit(temp).then(() => {if (msg.author.id == mega) {msge.delete(3000)}});
			return;
		}
		let t = performance.now();
		let evaled = eval(code);
		t = performance.now() - t;
		if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
		evaled = clean(evaled);
		if (evaled.startsWith('Promise')) temp = `**Исход: успех!**\n Код выполнился за \`\`${t.toFixed(5)}\`\`мс.`;
		else temp = `**Исход: успех!**\n `+(evaled.length > 2000 ? 'Исход итерации занял более 2К символов!' : `\`\`\`Js\n${evaled}\`\`\``)+` \n Код выполнился за \`\`${t.toFixed(5)}\`\`мс.`;
		msge.edit(temp).then(() => {if (msg.author.id == mega) {msge.delete(3000)}});
	} catch (err) {
		temp = `**Исход: ошибка!**\n Наименование: \`\`${err.name}\`\` \n \n \`\`${err.message}\`\``;
		msge.edit(temp).then(() => {if (msg.author.id == mega) {msge.delete(3000)}});
	}

	// let embed = new client.userLib.discord.RichEmbed();
	// let systemembed = new client.userLib.discord.RichEmbed().setAuthor('Исход: в процессе.').setColor('#FAA61A').setFooter(msg.author.tag);
	// msg.channel.send(systemembed).then(msge => {
	//   let embededit = new client.userLib.discord.RichEmbed();
	//   try {
	//     const code = args.join(" ");
	// 		if (code.indexOf('token') != -1) {
	// 			embededit.setAuthor('Исход: ошибка!').setTitle('Сообщение:').addField('Информация об ошибке', `Наименование: \`\`Defend\`\``).setColor('#F04747').setDescription(`\`\`Try to catch token\`\``).setFooter(msg.author.tag);
	// 			msge.edit(embededit);
	// 			return;
	// 		}
	//     var t0 = performance.now();
	//     let evaled = eval(code);
	//     var t1 = performance.now();
	//     if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
	//     if (clean(evaled).startsWith('Promise')) embededit.setAuthor('Исход: успех!').setTitle('Результат: выполнено!').addField('Информация', `Код выполнился за \`\`${t1 - t0}\`\`мс.`).setColor('#43B581').setFooter(msg.author.tag);
	//     else embededit.setAuthor('Исход: успех!').setTitle('Результат:').setDescription(evaled.length > 2000 ? 'Исход итерации занял более 2К символов!' : `\`\`\`Js\n${clean(evaled)}\`\`\``).addField('Информация', `Код выполнился за \`\`${t1 - t0}\`\`мс.`).setColor(evaled.length > 2000 ? '#727C8A' : '#43B581').setFooter(msg.author.tag);
	//     msge.edit(embededit);
	//   } catch (err) {
	//     embededit = new client.userLib.discord.RichEmbed().setAuthor('Исход: ошибка!').setTitle('Сообщение:').addField('Информация об ошибке', `Наименование: \`\`${err.name}\`\`\nСтрока: \`\`${err.lineNumber}\`\`\nПозиция: \`\`${err.columnNumber}\`\``).setColor('#F04747').setDescription(`\`\`${err.message}\`\``).setFooter(msg.author.tag);
	//     msge.edit(embededit);
	//   }
	// });
};