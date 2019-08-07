var owjs = require('overwatch-js');

exports.help = {
    name: "overprof",
    description: "Профиль игрока Overwatch",
    usage: "overprof [Ник]",
    flag: 3,
    cooldown: 15000
};

exports.run = (client, msg, args, Discord) => {
  var embed = new Discord.RichEmbed();

  let nickname = args.join(" ");
  if (!nickname) { embed.setColor(client.userLib.config.colors.err).setTitle('Ошибка!').setDescription(`Вы не ввели никнейм игрока!`); return msg.channel.send(embed); }

  msg.channel.startTyping();
  owjs.search(nickname).then((data) => {
    if (!data[0]) { msg.channel.stopTyping(); embed.setColor(client.userLib.config.colors.err).setTitle('Ошибка!').setDescription(`Такого игрока нет в базе данных OverWatch!`); return msg.channel.send(embed); }
    embed
      .setColor(client.userLib.config.colors.inf)
      .setThumbnail(`https://d1u1mce87gyfbn.cloudfront.net/game/unlocks/${data[0].portrait}.png`)
      .addField("Имя", `${data[0].name} (ID: ${data[0].id})`)
      .addField("Платформа", data[0].platform.toUpperCase())
      .addField("Уровень", data[0].playerLevel);
    msg.channel.stopTyping();
    msg.channel.send(embed);
  });
};