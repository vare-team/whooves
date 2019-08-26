exports.help = {
    name: 'help',
    description: 'Лист команд, позволяет узнать более подробную информацию о каждой команде.',
    aliases: ['commands'],
    usage: '[command name]',
    tier: 0,
    cooldown: 5
}

exports.run = async (client, msg, args) => {
    const data = [];
    const { commands } = msg.client;

    function list(cat, cname) {
        return `**__${cname}__**: ${commands
            .filter(cmd => cmd.module == cat)
            .map(cmd => `\`${cmd.help.name}\``)
            .join(", ")}`;
    }

    if (!args.length) {
        data.push('Категории:');
        if (client.userLib.admins.indexOf != -1) {
            data.push(list('dev', 'Команды разработчиков:'));
        }
        data.push(list('mod', 'Модерация и конфигурация:'));
        data.push(list('social', 'Социальные:'));
        data.push(list('games', 'Игры:'));
        data.push(list('fun', 'fun:'));
        data.push(list('others', 'Остальные:'));
        data.push(`\nВы можете написать \`${prefix}help [command name]\` чтобы получить подробную информацию!`);

        let embed = new client.userLib.discord.RichEmbed()
            .setColor(client.userLib.colors.inf)
            .setDescription(data)
            .setTitle('Список команд');
        return msg.channel.send({ embed: embed, split: true }).catch(err => {
            msg.channel.send(data, { split: true })
        });
    }


    const name = args[0].toLowerCase();
    const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

    if (!command) return msg.reply('Вы не указали команду!');

    let embed = new client.userLib.discord.RichEmbed().setAuthor(client.user.username, client.user.avatarURL).setColor(client.userLib.colors.inf).setTitle("Команда: " + command.help.name);

    if (command.help.aliases) embed.addField("Псевдонимы", command.help.aliases.join(', '));
    if (command.help.description) embed.addField("Описание", command.help.description);
    if (command.help.usage) embed.addField("Использование", `${prefix}${command.help.name} ${command.help.usage}`);
    embed.addField("Временное ограничение", `${command.cooldown || 3} секунд`);

    msg.channel.send(embed);
};