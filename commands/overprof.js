var owjs = require('overwatch-js');

exports.help = {
    name: "overprof",
    description: "Профиль игрока Overwatch",
    usage: "overprof [Ник]",
    flag: 3,
    cooldown: 15000
};

exports.run = (client, msg, args, Discord) => {
  let nickname = args.join(" ");
  if (!nickname) return;
  msg.channel.startTyping();
  owjs.search(nickname)
  .then((data) => {
    if (!data[0]) {msg.channel.stopTyping();return msg.reply(`Игрок __${args[1]}__ не найден!`);}
    embed
      .setThumbnail(data[0].portrait)
      .addField("Имя", data[0].name)
      .addField("Платформа", data[0].platform.toUpperCase())
      .addField("Уровень", `${data[0].tier}${data[0].level}`);
    msg.channel.stopTyping();
    msg.channel.send(embed);
  });
};