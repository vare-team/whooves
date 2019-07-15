console.log('Инициализация ядра...\nПодключение библиотек...');
var colors = require('colors');
const Discord = require('discord.js');
  client = new Discord.Client({disableEveryone: true});
console.log(`discord.js`.black.bgWhite + ` библиотека успешно подключена!`.white);
const Enmap = require("enmap");
console.log(`enmap`.black.bgWhite + ` библиотека успешно подключена!`.white);
const fs = require("fs");
console.log(`fs`.black.bgWhite + ` библиотека успешно подключена!`.white);
var mysql = require('mysql'),
  mysqlUtilities = require('mysql-utilities');
console.log(`mysql`.black.bgWhite + ` библиотека успешно подключена!`.white);

var client.db = mysql.createConnection({user: '', password: '', database: 'Akin', charset: "utf8mb4"});
client.db.on('error', (err) => {console.log(err)});
client.db.connect((err) => {if (err) return console.error('error connecting: ' + err.stack); console.log('Соединение с бд '.white+ `${client.db.threadId}`.black.bgWhite + ` успешно!`.white); delete err;});
mysqlUtilities.upgrade(client.db);
mysqlUtilities.introspection(client.db);

console.log(`Подключение конфига `.white+` config.json`.black.bgWhite);
client.config = require("./config");
client.discord = Discord;
console.log(`Конфиг `.white+`config.json`.black.bgWhite+` загржен!\n`.white);

fs.readdir("/root/bots/akin/events/", (err, files) => {
  if (err) return console.error(err);
  let counter = files.length;
  let counteris = 0;
  files.forEach(file => {
    counteris++;
    if (!file.endsWith(".js")) return;
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
    console.log(`Ивент `.white+`${eventName}`.black.bgWhite+` загржен. [${counteris}/${counter}]`.white);
    delete require.cache[require.resolve(`./events/${file}`)];
  });
  if (counter == counteris) console.log('Все ивенты загружены!\n'.white);
});

client.commands = new Enmap();

fs.readdir("/root/bots/akin/commands/", (err, files) => {
  if (err) return console.error(err);
  let counter = files.length;
  let counteris = 0;
  files.forEach(file => {
    counteris++;
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    client.commands.set(commandName, props);
    console.log(`Команда `.white+`${commandName}`.black.bgWhite+` загржена. [${counteris}/${counter}]`.white);
  });
  if (counter == counteris) console.log('Все команды загружены!\n'.white);
});

client.login(client.config.token);