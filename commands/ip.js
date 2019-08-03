exports.help = {
    name: "ip",
    description: "Данные по IP адресу",
    usage: "ip [ip]",
    flag: 3,
    cooldown: 5000
};

var request = require('request');
exports.run = (client, msg, args, Discord) => {
  var embed = new Discord.RichEmbed();

  let ipaddr = args[0];
  if (!ipaddr) {embed.setColor(client.userLib.config.colors.err).setTitle('Ошибка!').setDescription('Вы не указали IP адрес!'); return msg.channel.send(embed); }

    request('http://ip-api.com/json/' + ipaddr, { json: true }, function (err, res, data) {
      if (!data.country) {embed.setColor(client.userLib.config.colors.err).setTitle('Ошибка!').setDescription('Вы указали некорректный IP адрес!'); return msg.channel.send(embed); }
      embed
        .setColor(client.userLib.config.colors.inf)
        .setTitle('Информация о '+ data.query)
        .addField('Провайдер', data.isp)
        .addField('Организация', data.org)
        .addField('Страна', data.country ? data.country : 'Не ясно')
        .addField('Регион', data.regionName ? data.regionName : 'Не ясно')
        .addField('Город', data.city ? data.city : 'Не ясно')
        .setTimestamp();
      
      return msg.channel.send(embed);
    });
};