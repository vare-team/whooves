

exports.help = {
    name: "ip",
    description: "Данные по IP адресу",
    usage: "ip [ip]",
    flag: 3,
    cooldown: 5000
}

var request = require('request');

exports.run = (client, msg, args, Discord) => {

  if (!args[1]) return;

  request('http://api.sypexgeo.net/json/' + args[1], function (error, response, body) {
    data = JSON.parse(body);
    if (!data.country) {embed = new client.discord.RichEmbed().setColor(client.config.colors.err ).setTitle('Ошибка!').setDescription('Не корректный IP адрес!').setTimestamp();return msg.channel.send({embed});}
    embed = new client.discord.RichEmbed()
    .setColor(client.config.colors.inf)
    .setTitle('Информация о '+ data.ip)
    .addField('Страна', data.country.name_ru ? data.country.name_ru : 'Не ясно')
    .addField('Регион', data.region.name_ru ? data.region.name_ru : 'Не ясно')
    .addField('Город', data.city.name_ru ? data.city.name_ru : 'Не ясно')
    .addField('Почовый индекс', data.city.post ? data.city.post : 'Не ясно')
    .addField('Телефон', data.country.phone ? `+${data.country.phone}${data.city.tel}  ___ __ __` : 'Не ясно')
    .setTimestamp();
  msg.channel.send({embed});
  });

}