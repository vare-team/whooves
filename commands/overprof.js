
exports.help = {
    name: "overprof",
    description: "Профиль игрока Overwatch",
    usage: "overprof [Ник]",
    flag: 3,
    cooldown: 15000
}

var owjs = require('overwatch-js');
let embed;

exports.run = (client, msg, args, Discord) => {
  if (!args[1]) return;
  msg.channel.startTyping();
  owjs.search(args[1])
  .then((data) => {
    if (!data[0]) {msg.channel.stopTyping();return msg.reply(`Игрок __${args[1]}__ не найден!`);}
    embed = new Discord.RichEmbed()
    .setThumbnail(data[0].portrait)
    .addField("Имя", data[0].name)
    .addField("Платформа", data[0].platform.toUpperCase())
    .addField("Уровень", `${data[0].tier}${data[0].level}`);
    msg.channel.stopTyping();
    msg.channel.send({embed});
  });
};