module.exports = (client) => {
  client.user.setPresence({ game: { name: client.config.game.replace("{prefix}", client.config.prefix), type: client.config.gtype }});
  console.log(`Бот авторизован как `.white + `${client.user.tag}`.black.bgWhite + `!`.white);
};