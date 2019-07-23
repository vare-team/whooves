module.exports = (client) => {
  client.user.setPresence({ game: { name: client.userLib.config.game.replace("{prefix}", client.userLib.config.prefix), type: client.userLib.config.gtype }});
  console.log(`Бот авторизован как ${client.user.tag}`);
};