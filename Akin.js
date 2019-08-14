const Discord = require('discord.js')
    , client = new Discord.Client()
    , fs = require("fs")
    , func = require("./func")
    ;

let con = require('mysql2').createConnection({user: "root", password: "rXP5n5emm7", database: "Akin", charset: "utf8mb4"});
con.on('error', (err) => { console.warn(err) });
con.connect(() => {client.userLib.sendLog(`{DB Connected} (ID:${con.threadId})`);});
require('mysql-utilities').upgrade(con);
require('mysql-utilities').introspection(con);

client.userLib = new func(Discord, client, con);

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

client.login('NTYzNzI2Nzg0ODkwNDA0ODc0.XUGasA.QEg-fgfmLBMpZaut7Ve1R8fFJso');