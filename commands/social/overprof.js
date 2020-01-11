exports.help = {
  name: "overprof",
  description: "Профиль игрока Overwatch",
  aliases: [],
  dm: 0,
  tier: 0,
  usage: "[Ник]",
  cooldown: 1,
  hide: 1
};

exports.run = async (client, msg, args) => {
  msg.channel.startTyping();

  let data = await owjs.search(args[0]);

  if (!data[0]) {
    msg.channel.stopTyping();
    msg.reply(`Игрок __${args[0]}__ не найден!`);
    return;
  }

  let embed = new client.userLib.discord.RichEmbed()
    .setThumbnail(data[0].portrait)
    .addField("Имя", data[0].name)
    .addField("Платформа", data[0].platform.toUpperCase())
    .addField("Уровень", `${data[0].tier}${data[0].level}`);

  msg.channel.stopTyping();
  msg.channel.send(embed);
};