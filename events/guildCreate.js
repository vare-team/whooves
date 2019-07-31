module.exports = (client, guild) => {

  client.userLib.db.count('guilds', {id: guild.id}, (err, count) => {
    if (err) throw err;
    if (!count) client.userLib.db.insert(`guilds`, {id: guild.id, prefix: ';', logchannel: '0',moneyico: '💸'}, () => {});
  });

  console.log(`Новый сервер "${guild.name}", владелец "${guild.owner.user.tag}", всего там "${guild.memberCount}" участников.`);
};