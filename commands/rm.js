exports.help = {
    name: "rm",
    description: "",
    usage: "",
    flag: 0,
    cooldown: 0
};

exports.run = (client, msg, args) => {
  const commandName = args[0];
  if(!commandName) return msg.reply('Вы не указали команду!');
  if(!client.commands.has(commandName)) return msg.reply(`Команды __${commandName}__ не существует!`);
  
  delete require.cache[require.resolve(`./${commandName}.js`)];
  client.commands.delete(commandName);
  
  const props = require(`./${commandName}.js`);
  client.commands.set(commandName, props);
  msg.reply(`Команда __${commandName}__ обновлена.`);
};