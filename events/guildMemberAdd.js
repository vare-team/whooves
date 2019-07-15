var moment = require('moment');
moment.locale('ru');

module.exports = (client, member) => {

  client.db.queryValue('SELECT logchannel FROM servers WHERE id = ?', [member.guild.id], (err, logchannel) =>   {
    if (logchannel == '0') return;

    let av = member.user.avatarURL ? member.user.avatarURL : member.user.defaultAvatarURL;

    let embed = new client.discord.RichEmbed()
      .setColor(client.config.colors.inf)
      .setTitle('Новый участник на сервере!')
      .setAuthor(member.user.tag, av)
      .setDescription(`Аккаунт зарегистрирован **${moment(member.user.createdAt, "WWW MMM DD YYYY HH:mm:ss").fromNow()}**`)
      .setFooter(`ID: ${member.user.id}`)
      .setTimestamp();
    let sendlogchannel = client.channels.get(logchannel);
    if (!sendlogchannel) return client.db.upsert(`servers`, {id: msg.guild.id, logchannel: 0}, (err) => {});

    sendlogchannel.send({embed}).catch(err => console.log(`\nОшибка!\nСервер: ${member.guild.name} (ID: ${member.guild.id})\nПользователь: ${member.user.tag} (ID: ${member.user.id})\nТекст ошибки: ${err}`));
  })

};
