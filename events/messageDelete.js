let embed, av;

function isUrl(s) {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return regexp.test(s);
}

module.exports = (client, msg) => {

  if (msg.author.id == client.user.id) return;
  if (msg.author.bot) return;

  client.userLib.db.queryValue('SELECT logchannel FROM guilds WHERE id = ?', [msg.guild.id], (err, logchannel) => {
    if (msg.content == '') msg.content = 'Что-то';
    if (logchannel == '0') return;
    let av = msg.author.avatarURL;
    if (!msg.author.avatarURL) av = msg.author.defaultAvatarURL;
    embed = new Discord.RichEmbed()
        .setColor(client.config.colors.inf)
        .setTitle('Удалённое сообщение')
        .setAuthor(msg.author.tag, av)
        .setDescription(`\`\`\`${msg.content.replace(new RegExp("\`",'g'),"")}\`\`\``)
        if (isUrl(msg.content)) embed.addField('Причина', 'Найдена ссылка.')
        embed.setTimestamp()
        .addField('Канал', `<#${msg.channel.id}>`)
        .setFooter(`ID: ${msg.author.id}`);
    let sendlogchannel = client.channels.get(logchannel);
    if (!sendlogchannel) return client.userLib.db.upsert(`servers`, {id: msg.guild.id, logchannel: 0}, (err) => {});
    sendlogchannel.send({embed}).catch(err => console.log(`\nОшибка!\nСервер: ${msg.guild.name} (ID: ${msg.guild.id})\nКанал: ${msg.channel.name} (ID: ${msg.channel.id})\nПользователь: ${msg.author.tag} (ID: ${msg.author.id})\nТекст ошибки: ${err}`));
  });

};