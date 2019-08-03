const rand = require('random');

talkedMoney = new Set();
talkedcool = new Set();

function isUrl(s) {
    let regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return regexp.test(s);
}

let embed;

permissions = ['ADMINISTRATOR' ,'VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'MANAGE_ROLES']

module.exports = (client, msg) => {

  client.userLib.db.queryValue('SELECT prefix FROM guilds WHERE id = ?', [msg.guild.id], (err, prefix) => {
    if (msg.author.bot || msg.channel.type == 'dm') return;

    client.userLib.db.count('account', {id: msg.author.id}, (err, count) => {
      if (!count) client.userLib.db.insert(`account`, {id: msg.author.id}, (error) => { if(error) throw error; });
    });

    function addmoney() {
      if (talkedMoney.has(`${msg.guild.id}_${msg.author.id}`)) return;
      talkedMoney.add(`${msg.guild.id}_${msg.author.id}`);
      setTimeout(() => {talkedMoney.delete(`${msg.guild.id}_${msg.author.id}`);}, 60000);
      client.userLib.db.query(`UPDATE account SET coins = coins + ? WHERE id = ?`, [rand.int(10, 25), msg.author.id])
    }

    const args = msg.content.slice(prefix.length).trim().split(/ +/g);

    if (isUrl(msg.content.toLowerCase())) {
      if (msg.author.bot || msg.guild.ownerID == msg.author.id || msg.member.hasPermission('ADMINISTRATOR')) return;
      const cmd = client.commands.get('warn');
      return cmd.run(client, msg, args, client.discord, true);
    }

    if (err) throw err;
    if (!msg.content.startsWith(prefix)) return addmoney();
    if (msg.content.toLowerCase().startsWith(prefix + 'help')) {const cmd = client.commands.get('help'); return cmd.run(client, msg, args, client.userLib.discord);};

    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command);
  
    if (!cmd) return;

    if(!msg.channel.memberPermissions(client.user).has('EMBED_LINKS')) return msg.reply('Хмм... Ошибочка. Вы не дали мне право на отправку ссылок (EMBED_LINKS)!\n**Не надо так!**')

    let flag = cmd.help.flag, cooldown = cmd.help.cooldown;
  
    switch (flag){
      case 2:
        if (!msg.member.hasPermission('ADMINISTRATOR')) {embed = new client.userLib.discord.RichEmbed().setColor(client.userLib.config.colors.err ).setTitle('Ошибка!').setDescription('У тебя не достаточно прав!').setTimestamp();return msg.channel.send({embed});}
        break;
      case 1:
        if (msg.guild.ownerID !== msg.author.id) {embed = new client.userLib.discord.RichEmbed().setColor(client.userLib.config.colors.err).setTitle('Ошибка!').setDescription(`Эту команду может использовать только владелец сервера <@${msg.guild.ownerID}>!`). setTimestamp();return msg.channel.send({embed});}
        break;
      case 0:
        if (client.userLib.config.owners.indexOf(msg.author.id) == -1) {embed = new client.userLib.discord.RichEmbed().setColor(client.userLib.config.colors.err).setTitle('Ошибка!').setDescription(`Эту команду может использовать только разработчик бота!`).setTimestamp();return msg.channel.send({embed});}
        break;
    }

    let temp = `${msg.guild.id}${msg.author.id}${cmd.help.name}`;

    if (talkedcool.has(temp)) return;
    talkedcool.add(temp);
    setTimeout(() => {talkedcool.delete(temp);}, cooldown);

    // if(!msg.channel.memberPermissions(client.user).has(permissions)) return console.log(`Ошибка!\nКоманда - ${cmd.help.name}\nСервер: ${msg.guild.name} (ID: ${msg.guild.id})\nПользователь: ${msg.author.tag} (ID: ${msg.author.id})\nТекст ошибки: ${err}`)

    try {
      cmd.run(client, msg, args, client.userLib.discord)
    } catch (err) {
      console.log(`\nОшибка!\nКоманда - ${cmd.help.name}\nСервер: ${msg.guild.name} (ID: ${msg.guild.id})\nКанал: ${msg.channel.name} (ID: ${msg.channel.id})\nПользователь: ${msg.author.tag} (ID: ${msg.author.id})\nТекст ошибки: ${err}`)
    };
    

  });

};