module.exports = (client, member) => {

  client.db.queryValue('SELECT logchannel FROM servers WHERE id = ?', [member.guild.id], (err, logchannel) => {
    if (logchannel == '0') return;
    let av = member.user.avatarURL;
    if (!member.user.avatarURL) av = member.user.defaultAvatarURL;
    let embed = new client.discord.RichEmbed()
      .setColor(client.config.colors.inf)
      .setTitle('Участник покинул сервер!')
      .setAuthor(member.user.tag, av)
      .setFooter(`ID: ${member.user.id}`)
      .setTimestamp();
    let sendlogchannel = client.channels.get(logchannel);
    if (!sendlogchannel) return client.db.upsert(`servers`, {id: member.guild.id, logchannel: 0}, (err) => {});
    sendlogchannel.send({embed}).catch(err => console.log(`\nОшибка!\nСервер: ${member.guild.name} (ID: ${member.guild.id})\nПользователь: ${member.user.tag} (ID: ${member.user.id})\nТекст ошибки: ${err}`));
  })

};