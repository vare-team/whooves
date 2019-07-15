module.exports = (client, guild) => {

  client.db.count('servers', {id: guild.id}, (err, count) => {
    if (!count) client.db.insert(`servers`, {id: guild.id, prefix: ';', logchannel: '0',moneyico: '💸', modrole: '0'}, () => {})
  });

  console.log(`Новый сервер "${guild.name}", владелец "${guild.owner.user.tag}", всего там "${guild.memberCount}" участников.`)

};