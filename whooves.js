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
      client.userLib.sendLog(`[EVENT] "${file}" loaded.`, "START");
    } catch (e) {
      console.warn(e);
      client.userLib.sendLog(`[EVENT] Loading failed "${file}".`, "START");
    }
  });
});

client.ws.on('INTERACTION_CREATE', async interaction => {
  const args = interaction.data["custom_id"].split("_");

  if (!interaction.member) {
    interaction.member = {};
    interaction.member.user = interaction.user;
  }

  if (args[1] !== interaction.member.user.id) return;

  const command = args[0];
  const cmd = client.commands.get(command);
  if (!cmd || !cmd.help.interactions) return;

  cmd.interaction(client, interaction, args);
  client.userLib.sendLog(client.userLib.generateUseLog("interaction", cmd.help.name, interaction), 'Info');
})

client.commands = new Discord.Collection();

readdir('./commands/', (error, directories) => {
  if (error) return console.warn(error);
  directories.filter(dir => lstatSync(`./commands/${dir}`).isDirectory())
    .forEach(module => {
      client.userLib.sendLog(`[MODULE] "${module}" module found.`, "START");
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
              client.userLib.sendLog(`[COMMAND] "${module}/${file}" loaded.`, "START");
            } catch (e) {
              console.warn(e);
              client.userLib.sendLog(`[COMMAND] Loading failed "${file}".`, "START");
            }
          });
      });
    });
});

client.login(process.env.token);