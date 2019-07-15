const Discord = require('discord.js');
let embed;

module.exports = (client, oldMember, newMember) => {

  client.db.queryValue('SELECT logchannel FROM servers WHERE id = ?', [oldMember.guild.id], (err, logchannel) => {
    if (logchannel == '0') return;
    let sendlogchannel = client.channels.get(logchannel);
    if (!newMember.user.avatarURL) newMember.user.avatarURL = newMember.user.defaultAvatarURL;
    if (!sendlogchannel) return client.db.upsert(`servers`, {id: msg.guild.id, logchannel: 0}, (err) => {});

    if (!oldMember.voiceChannel) {
      embed = new Discord.RichEmbed()
      .setColor(client.config.colors.inf)
      .setTitle(`Подключился к "${newMember.voiceChannel.name}"`)
      .setAuthor(oldMember.user.tag, newMember.user.avatarURL)
      .setFooter(`ID: ${oldMember.user.id}`)
      .setTimestamp();
      return sendlogchannel.send({embed}).catch(err => console.log(`\nОшибка!\nСервер: ${oldMember.guild.name} (ID: ${oldMember.guild.id})\nПользователь: ${oldMember.tag} (ID: ${oldMember.id})\nТекст ошибки: ${err}`));
    };
    if (!newMember.voiceChannel) {
      embed = new Discord.RichEmbed()
      .setColor(client.config.colors.inf)
      .setTitle(`Отключился от "${oldMember.voiceChannel.name}"`)
      .setAuthor(oldMember.user.tag, newMember.user.avatarURL)
      .setFooter(`ID: ${oldMember.user.id}`)
      .setTimestamp();
      return sendlogchannel.send({embed}).catch(err => console.log(`\nОшибка!\nСервер: ${oldMember.guild.name} (ID: ${oldMember.guild.id})\nПользователь: ${oldMember.tag} (ID: ${oldMember.id})\nТекст ошибки: ${err}`));
    };
    if (oldMember.voiceChannel && newMember.voiceChannel) {
      embed = new Discord.RichEmbed()
      .setColor(client.config.colors.inf)
      .setTitle(`Переместился из "${oldMember.voiceChannel.name}" в "${newMember.voiceChannel.name}"`)
      .setAuthor(oldMember.user.tag, newMember.user.avatarURL)
      .setFooter(`ID: ${oldMember.user.id}`)
      .setTimestamp();
      return sendlogchannel.send({embed}).catch(err => console.log(`\nОшибка!\nСервер: ${oldMember.guild.name} (ID: ${oldMember.guild.id})\nПользователь: ${oldMember.tag} (ID: ${oldMember.id})\nТекст ошибки: ${err}`));
    }
  });
};