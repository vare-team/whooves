let embed;
const fs = require("fs");

exports.help = {
    name: "help",
    description: "Вывести список всех команд, или вывести информацию об отдельной команде.",
    usage: "help (команда)",
    flag: 3,
    cooldown: 500
}

exports.run = (client, msg, args, Discord) => {

    client.db.queryValue('SELECT prefix FROM servers WHERE id = ?', [msg.guild.id], (err, prefixtemp) => {

        if (!args[1]) {

    	   fs.readdir("./commands/", (err, files) => {
                if(err) console.error(err);
        
                let jsfiles = files.filter(f => f.split(".").pop() === "js");
                if(jsfiles.length <= 0) {
                    console.log("No commands to load!");
                    return;
                }
        
                let gNamelistO = "";
                let gNamelistA = "";
                let gNamelistU = "";
        
                let flag = 3;
        
                if (msg.guild.ownerID == msg.author.id) flag = 1;
                else if (msg.member.hasPermission('ADMINISTRATOR')) flag = 2;
        
                let result = jsfiles.forEach((f, i) => {
                    let props = require(`./${f}`);
                    let namelist = props.help.name;
                    let desclist = props.help.description;
                    let usage = props.help.usage;
        
                    if (props.help.flag == 1) gNamelistO += "\`\`" + prefixtemp + namelist + "\`\`, ";
                    else if (props.help.flag == 2) gNamelistA += "\`\`" + prefixtemp + namelist + "\`\`, ";
                    else if (props.help.flag == 3) gNamelistU += "\`\`" + prefixtemp + namelist + "\`\`, ";
                });
        
                embed = new Discord.RichEmbed()
                    .setColor(client.config.colors.inf)
                    .setDescription(`Напиши **${prefixtemp}help (команда)** для получения информации об определенной команде.\n\`\`[] - обязательный аргумент\n() - дополнительный аргумент\`\``)
                    .setAuthor('Список команд AKin', client.user.avatarURL);
        
                switch (flag) {
                    case 1:
                        embed.addField('❯ Владелец', gNamelistO.substring(0, gNamelistO.length - 2));
                    case 2:
                        embed.addField('❯ Админ', gNamelistA.substring(0, gNamelistA.length - 2));
                    case 3:
                        embed.addField('❯ Пользователь', gNamelistU.substring(0, gNamelistU.length - 2));
                        break;
                }
        
                msg.channel.send({embed});
            });
        } else {

            if (!client.commands.has(args[1])) return;

            let props = require(`./${args[1]}.js`);
            let namelist = props.help.name;
            let desclist = props.help.description;
            let usage = props.help.usage;
            let cooldown = props.help.cooldown;

            if (props.help.flag == 0) return;

            embed = new Discord.RichEmbed()
            .setThumbnail(client.user.avatarURL)
            .setColor(client.config.colors.inf)
            .setTitle(`Команда ${prefixtemp}${namelist}`)
            .addField('Описание', desclist)
            .addField('Откат', `**${cooldown/1000}** сек.`)
            .addField('Использование', `\`\`${prefixtemp}${usage}\`\``);
            msg.channel.send({embed});
        }
    });
};