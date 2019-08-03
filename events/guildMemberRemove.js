module.exports = (client, member) => {

  client.userLib.db.queryValue('SELECT logchannel FROM guilds WHERE id = ?', [member.guild.id], (err, logchannel) => {
    if (logchannel == '0') return;
    let av = member.user.avatarURL;
    if (!member.user.avatarURL) av = member.user.defaultAvatarURL;

    let sendlogchannel = client.channels.get(logchannel);
    if (!sendlogchannel) return client.userLib.db.upsert(`servers`, {id: member.guild.id, logchannel: 0}, (err) => {});
    sendlogchannel.send({embed}).catch(err => console.log(`\nОшибка!\nСервер: ${member.guild.name} (ID: ${member.guild.id})\nПользователь: ${member.user.tag} (ID: ${member.user.id})\nТекст ошибки: ${err}`));
  }); 
};