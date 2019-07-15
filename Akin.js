let color = require('colors');
const Discord = require('discord.js'),
client = new Discord.Client();
const fs = require("fs");

let con = require('mysql').createConnection({user: "", password: "", database: "Akin", charset: "utf8mb4"});
con.on('error', (err) => {console.warn(err)});
con.connect(() => {client.userLib.sendlog(`{DB Connected} (ID:${con.threadId})`);});
require('mysql-utilities').upgrade(con);
require('mysql-utilities').introspection(con);

client.userLib = {};

client.userLib.config = require("./config");
client.userLib.discord = Discord;
client.userLib.db = con;
client.userLib.presenseCount = 0;
// client.userLib.cooldown = new Map();

client.userLib.sendlog = (log) => {
  const now = new Date();
  console.log(`${('00' + now.getHours()).slice(-2) + ':' + ('00' + now.getMinutes()).slice(-2) + ':' + ('00' + now.getSeconds()).slice(-2)} | Shard[${client.shard.id}] : ${log}`);
};

client.userLib.presenseFunc = () => {
  switch (client.userLib.presenseCount) {
    case 1:
      client.user.setPresence({ game: { name: `Серверов на ${client.userLib.shardName[client.shard.id]}: ${client.guilds.size}`, type: 'LISTENING' }});
      client.userLib.presenseCount = 0;
      break;
  }

  client.userLib.presenseCount++;
};

con.queryKeyValue('SELECT id, tier FROM admins WHERE 1', (err, result) => client.userLib.admins = result);

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.filter(file => file.endsWith('.js')).forEach(file => {
    try {
      const event = require(`./events/${file}`);
      let eventName = file.split(".")[0];
      client.on(eventName, event.bind(null, client));
      delete require.cache[require.resolve(`./events/${file}`)];
    } catch (e) {console.warn(e)}
  });
});

client.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.filter(file => file.endsWith('.js')).forEach(file => {
    try {
      let props = require(`./commands/${file}`);
      let commandName = file.split(".")[0];
      client.commands.set(commandName, props);
    } catch (e) {console.warn(e)}
  });
});

client.login(client.userLib.config.token);
