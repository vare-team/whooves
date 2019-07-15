
exports.help = {
    name: "rm",
    description: "",
    usage: "",
    flag: 0,
    cooldown: 0
}

exports.run = (client, msg, args) => {
  if(!args || args.size < 1) return;
  const commandName = args[1];
  if(!client.commands.has(commandName)) return msg.reply(`Команды __${commandName}__ нет!`);
  delete require.cache[require.resolve(`./${commandName}.js`)];
  client.commands.delete(commandName);
  const props = require(`./${commandName}.js`);
  client.commands.set(commandName, props);
  msg.reply(`Команда __${commandName}__ обновлена.`);
};