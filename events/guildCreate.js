module.exports = (client, guild) => {
  client.userLib.db.insert(`guilds`, {id: guild.id, moneyico: '💸'}, () => {});
  // client.userLib.db.insert(`guilds`, {id: guild.id}, () => {});
  client.userLib.sendlog(`Новый сервер "${guild.name}", владелец "${guild.owner.user.tag}", всего там "${guild.memberCount}" участников.`);
};