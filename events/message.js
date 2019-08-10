module.exports = (client, msg) => {

  if (msg.author.bot || msg.channel.type == 'dm') return;
  
  const args = msg.content.slice(2).trim().split(/ +/g);

  if (msg.content.toLowerCase().startsWith('a.help')) {const cmd = client.commands.get('help'); return cmd.run(client, msg, args, client.discord);};

  client.userLib.db.queryValue('SELECT prefix FROM guilds WHERE id = ?', [msg.guild.id], (err, prefix) => {
    if (err) throw err;
    if (!msg.content.startsWith('a.')) return;
    
    const command = args[0].toLowerCase();
    const cmd = client.commands.get(command);
  
    if (!cmd) return;

    if(!msg.channel.memberPermissions(client.user).has('EMBED_LINKS')) return msg.reply('Хмм... Ошибочка. Вы не дали мне право на отправку ссылок (EMBED_LINKS)!\n**Не надо так!**')

    let flag = cmd.help.flag;
  
    switch (flag){
      case 2:
        if (!msg.member.hasPermission('ADMINISTRATOR')) {embed = new client.discord.RichEmbed().setColor(client.config.colors.err ).setTitle('Ошибка!').setDescription('У тебя не достаточно прав!').setTimestamp();return msg.channel.send({embed});}
        break;
      case 1:
        if (msg.guild.ownerID !== msg.author.id) {embed = new client.discord.RichEmbed().setColor(client.config.colors.err).setTitle('Ошибка!').setDescription(`Эту команду может использовать только владелец сервера <@${msg.guild.ownerID}>!`). setTimestamp();return msg.channel.send({embed});}
        break;
      case 0:
        if (client.config.owners.indexOf(msg.author.id) == -1) {embed = new client.discord.RichEmbed().setColor(client.config.colors.err).setTitle('Ошибка!').setDescription(`Эту команду может использовать только разработчик бота!`).setTimestamp();return msg.channel.send({embed});}
        break;
    }
    
    try {
      cmd.run(client, msg, args, client.discord)
    } catch (err) {
      console.log(`\nОшибка!\nКоманда - ${cmd.help.name}\nСервер: ${msg.guild.name} (ID: ${msg.guild.id})\nКанал: ${msg.channel.name} (ID: ${msg.channel.id})\nПользователь: ${msg.author.tag} (ID: ${msg.author.id})\nТекст ошибки: ${err}`)
    };
    

  });

};