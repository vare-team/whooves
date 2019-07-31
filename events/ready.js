module.exports = (client) => {
  setInterval(client.userLib.presenseFunc, 30000);
  console.log(`Бот авторизован как ${client.user.tag}`);
};