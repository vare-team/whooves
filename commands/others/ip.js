exports.help = {
  name: "ip",
  description: "Данные по IP адресу",
  aliases: [],
  usage: "[ip]",
  dm: 0,
  args: 1,
  tier: 0,
  cooldown: 5
};

exports.run = (client, msg, args) => {
  
  client.userLib.request('https://api.sypexgeo.net/json/' + args[0], {json: true}, (err, res, body) => {
    if (!body.country) {
      client.userLib.retError(msg.channel, msg.author,  'Не корректный IP адрес.'); return;
    }

    let embed = new client.userLib.discord.RichEmbed()
      .setColor(client.userLib.colors.inf)
      .setTitle('Информация о '+ body.ip)
      .addField('Страна', body.country.name_ru ? body.country.name_ru : 'Не ясно')
      .addField('Регион', body.region.name_ru ? body.region.name_ru : 'Не ясно')
      .addField('Город', body.city.name_ru ? body.city.name_ru : 'Не ясно')
      .addField('Почовый индекс', body.city.post ? body.city.post : 'Не ясно')
      .addField('Телефон', body.country.phone ? `\`\`+${body.country.phone} (${body.city.tel.slice(0, -1)}) ${body.city.tel.slice(-1)}__ __ __\`\`` : 'Не ясно')
      .setTimestamp();
    msg.channel.send(embed);
  });

};