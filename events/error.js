module.exports = (client, error) => {
  client.userLib.sendLog(`Ошибка - ${error.message}`);
};