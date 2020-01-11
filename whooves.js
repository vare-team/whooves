const Discord = require('discord.js')
  , client = new Discord.Client()
  , { readdir, lstatSync } = require("fs")
  , func = require("./func")
  ;

let con = require('mysql2').createConnection({ user: process.env.dblogin, password: process.env.dbpass, database: 'Whooves', host: process.env.dbhost, charset: 'utf8mb4' });
con.on('error', (err) => { console.warn(err) });
con.connect(() => { client.userLib.sendLog(`{DB Connected} (ID:${con.threadId})`); });
let util = require('mysql-utilities');
util.upgrade(con);
util.introspection(con);

client.userLib = new func(Discord, client, con);
client.statistic = {executedcmd: 0, erroredcmd: 0};

readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.filter(file => file.endsWith('.js')).forEach(file => {
    try {
      const event = require(`./events/${file}`);
      client.on(file.split(".")[0], event.bind(null, client));
      delete require.cache[require.resolve(`./events/${file}`)];
    } catch (e) { console.warn(e) }
  });
});

client.commands = new Discord.Collection();

readdir('./commands/', (error, directories) => {
  if (error) return console.warn(error);
  directories.filter(dir => lstatSync(`./commands/${dir}`).isDirectory())
    .forEach(module => {
      readdir(`./commands/${module}/`, (err, files) => {
        if (err) return console.error(err);
        files.filter(file => file.endsWith('.js'))
          .forEach(file => {
            try {
              const props = require(`./commands/${module}/${file}`);
              if (!props.help.hide) {
                props.help.module = module;
                client.commands.set(file.split(".")[0], props);
              }
            } catch (e) { console.warn(e) }
          });
      });
    });
});

client.login(process.env.token);