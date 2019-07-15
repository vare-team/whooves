
exports.help = {
    name: "vimeprof",
    description: "Профиль игрока VimeWorld",
    usage: "vimeprof [Ник]",
    flag: 3,
    cooldown: 15000
}
var translit = require('/home/pi/Bots/Akin/cyrylic.js');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

exports.run = (client, msg, args, Discord) => {
  if (!args[1]) return msg.reply('Ты не ввёл имя игрока!');
  msg.channel.startTyping();
  let Nick = translit().transform(args[1]);
  var req = new XMLHttpRequest();
  req.open('GET','http://api.vime.world/user/name/'+Nick, false);
  req.send();
  var dataa = JSON.parse(req.responseText)[0];
  if(!dataa){msg.channel.stopTyping(); return msg.reply(`Игрок "${Nick}" не найден `);}
  req.open('GET','http://api.vime.world/user/'+dataa.id+'/session', false);
  req.send();
  if (req.status == 200) {
    var data = JSON.parse(req.responseText);
    embed = new Discord.RichEmbed()
    .setAuthor(`Информация об игроке ${data.user.username}`, 'https://skin.vimeworld.ru/helm/'+data.user.username+'/100.png')
    .setTimestamp()
    if (data.user.rank != 'PLAYER') embed.addField('Ранг', `💸 **${data.user.rank}**`, true);
    embed.addField('Уровень',`⏳ **${data.user.level}**`, true)
    if (data.user.guild) embed.addField('Гильдия',`📣 **${data.user.guild.name}**`, true)
    embed.addField('Время игры', `🕑 **${Math.round(data.user.playedSeconds/60/60)}** ч.`, true)
    .addField('Ссылки',`**[🔗 VimeWorld.ru](https://vimeworld.ru/player/${data.user.username})\n[🔗 VimeTop.ru](https://vimetop.ru/player/${data.user.username})**`, true)
    .setThumbnail('https://skin.vimeworld.ru/body/'+data.user.username+'.png');
    if (data.online.value) {
      embed.setColor(client.config.colors.suc)
      .addField('Сейчас онлайн', `**${data.online.message}**`, true);
    } else {
      embed.setColor(client.config.colors.err);
    }
    msg.channel.stopTyping();
    return msg.channel.send({embed});
  } else {
    msg.channel.stopTyping();
    return msg.reply('Что-то пошло не так.');
  };
}