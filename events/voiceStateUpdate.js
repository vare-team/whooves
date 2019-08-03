let embed;

module.exports = async (client, oldMember, newMember) => {
  client.userLib.db.queryValue('SELECT logchannel FROM guilds WHERE id = ?', [oldMember.guild.id], (err, logchannel) => {
    if (logchannel == '0') return;
    let sendlogchannel = client.channels.get(logchannel);
    if (!newMember.user.avatarURL) newMember.user.avatarURL = newMember.user.defaultAvatarURL;
    if (!sendlogchannel) return client.db.upsert(`guilds`, {id: msg.guild.id, logchannel: 0}, (err) => {});

    if (!oldMember.voiceChannel) {
      embed = new client.userLib.discord.RichEmbed()
      .setColor(client.userLib.config.colors.inf)
      .setTitle(`Подключился к "${newMember.voiceChannel.name}"`)
      .setAuthor(oldMember.user.tag, newMember.user.avatarURL)
      .setFooter(`ID: ${oldMember.user.id}`)
      .setTimestamp();
    };
    if (!newMember.voiceChannel) {
      embed = new client.userLib.discord.RichEmbed()
      .setColor(client.userLib.config.colors.inf)
      .setTitle(`Отключился от "${oldMember.voiceChannel.name}"`)
      .setAuthor(oldMember.user.tag, newMember.user.avatarURL)
      .setFooter(`ID: ${oldMember.user.id}`)
      .setTimestamp();
    };
    if (oldMember.voiceChannel && newMember.voiceChannel) {
      embed = new client.userLib.discord.RichEmbed()
      .setColor(client.userLib.config.colors.inf)
      .setTitle(`Переместился из "${oldMember.voiceChannel.name}" в "${newMember.voiceChannel.name}"`)
      .setAuthor(oldMember.user.tag, newMember.user.avatarURL)
      .setFooter(`ID: ${oldMember.user.id}`)
      .setTimestamp();
      
    }
  });
};