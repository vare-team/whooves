exports.help = {
	name: "eval",
	description: "Испольнение кода",
	aliases: [],
	usage: "[JavaScript]",
	dm: 1,
	args: 1,
	tier: 2,
	cooldown: 0
};

function clean(text) {
	if (typeof(text) === "string")
		return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
	else
		return text;
}

const os = require('os')
	, { PerformanceObserver, performance } = require('perf_hooks');
exports.run = (client, msg, args) => {

	if (msg.author.id != '166610390581641217' && msg.author.id != '321705723216134154') {
		client.userLib.retError(msg.channel, msg.author, 'Что-то пошло по пизде, но 2 защита сохранила безопасность.');
		return;
	}

	let embed = new client.userLib.discord.RichEmbed();

	let systemembed = new client.userLib.discord.RichEmbed().setAuthor('Исход: в процессе.').setColor('#FAA61A').setFooter(msg.author.tag);
	msg.channel.send(systemembed).then(msge => {
	  let embededit = new client.userLib.discord.RichEmbed();
	  try {
	    const code = args.join(" ");
			if (code.indexOf('token') != -1) {
				embededit.setAuthor('Исход: ошибка!').setTitle('Сообщение:').addField('Информация об ошибке', `Наименование: \`\`Defend\`\``).setColor('#F04747').setDescription(`\`\`Try to catch token\`\``).setFooter(msg.author.tag);
				msge.edit(embededit);
				return;
			}
	    var t0 = performance.now();
	    let evaled = eval(code);
	    var t1 = performance.now();
	    if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
	    if (clean(evaled).startsWith('Promise')) embededit.setAuthor('Исход: успех!').setTitle('Результат: выполнено!').addField('Информация', `Код выполнился за \`\`${t1 - t0}\`\`мс.`).setColor('#43B581').setFooter(msg.author.tag);
	    else embededit.setAuthor('Исход: успех!').setTitle('Результат:').setDescription(evaled.length > 2000 ? 'Исход итерации занял более 2К символов!' : `\`\`\`Js\n${clean(evaled)}\`\`\``).addField('Информация', `Код выполнился за \`\`${t1 - t0}\`\`мс.`).setColor(evaled.length > 2000 ? '#727C8A' : '#43B581').setFooter(msg.author.tag);
	    msge.edit(embededit);
	  } catch (err) {
	    embededit = new client.userLib.discord.RichEmbed().setAuthor('Исход: ошибка!').setTitle('Сообщение:').addField('Информация об ошибке', `Наименование: \`\`${err.name}\`\`\nСтрока: \`\`${err.lineNumber}\`\`\nПозиция: \`\`${err.columnNumber}\`\``).setColor('#F04747').setDescription(`\`\`${err.message}\`\``).setFooter(msg.author.tag);
	    msge.edit(embededit);
	  }
	});

};