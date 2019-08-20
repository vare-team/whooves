module.exports = async (client, msg) => {
  if (msg.author.bot) return;

  if(msg.mentions.users.first() && msg.mentions.users.first().id == client.user.id) {
    msg.channel.send('Префикс: ' + prefix);
    return;
  }

  let prefix = msg.channel.type == 'dm' ? 'a.' : (await client.userLib.db.promise(client.userLib.db, client.userLib.db.queryValue, 'SELECT prefix FROM guilds WHERE id = ?', [msg.guild.id])).res;
  prefix = prefix ? prefix : 'a.';

  if(!msg.content.toLowerCase().startsWith(prefix)) return;

  if(!msg.channel.memberPermissions(client.user).has('ADMINISTRATOR')) return msg.reply('Хмм... Ошибочка. У бота не достаточно прав!');

  const [command, ...args] = msg.content.slice(prefix.length).trim().split(/ +/g);
  
  const cmd = client.commands.get(command.toLowerCase());

  if (!cmd) return;

  if(msg.channel.type == 'dm' && !cmd.help.dm) {
    msg.reply('Недоступно в личных сообщениях');
    return;
  }

  if(cmd.help.tier && !client.userLib.checkPerm(cmd.help.tier, msg.guild.ownerID, msg.member)) {
    msg.reply('недостаточно прав!');
    return;
  }

  if(!client.userLib.cooldown.has(cmd.help.name)) {
    client.userLib.cooldown.set(cmd.help.name, new Map() );
  }

  const now = Date.now();
  const times = client.userLib.cooldown.get(cmd.help.name);
  if(times.has(msg.author.id)) {
    let timeLeft = (times.get(msg.author.id) + cmd.help.cooldown * 1000 - now) / 1000;
    msg.reply('используйте команду позже! Вы сможете использовать команду через: ' + timeLeft + ' секунд');
    return;
  }

  if(cmd.help.args && !args.length) {
    msg.reply('отсутствует аргументы!');
    return;
  }

  times.set(msg.author.id, now);
  setTimeout(() => { times.delete(msg.author.id); }, cmd.help.cooldown * 1000);

  try {
    cmd.run(client, msg, args);
  } catch (err) {
    client.userLib.sendLog(`\nОшибка!\nКоманда - ${cmd.help.name}\nСервер: ${msg.guild.name} (ID: ${msg.guild.id})\nКанал: ${msg.channel.name} (ID: ${msg.channel.id})\nПользователь: ${msg.author.tag} (ID: ${msg.author.id})\nТекст ошибки: ${err}`);
  };

};

/* 
  flag
  
  -3 - Owner guild

  -2 - Admin guild

  -1 - Moderator guild

  0 - user

  1 - admin tier 0

  2 - admin tier 1
*/
