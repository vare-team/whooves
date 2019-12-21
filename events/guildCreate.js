module.exports = (client, guild) => {
  client.userLib.db.insert(`guilds`, {guildId: guild.id}, () => {});
  client.userLib.sendLog(`Новый сервер "${guild.name}", владелец "${guild.owner.user.tag}", всего там "${guild.memberCount}" участников.`);
};