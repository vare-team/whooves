exports.help = {
    name: "delprerole",
    description: "Удаляет все роли, созданные интеграцией\n**Роль Akin'а должна быть выше всех!**",
    usage: "delprerole",
    flag: 1,
    cooldown: 10000
};

exports.run = async (client, msg, args, Discord) => {
	var embed = new Discord.RichEmbed();

	let count, i;
	await msg.guild.roles.forEach((role) => { if (role.managed) count += 1; } );
	await msg.guild.roles.forEach((role) => { if (role.managed) { role.delete('Автогенерируемая роль'); i++; } } );

	embed.setColor(client.userLib.config.colors.err).setTitle('Ошибка!').setDescription(`Невозможно удалить роль, так как не хватает прав!\n**Роль Akin'а должна быть выше всех!**`);  		
	if (i == count) embed.setColor(client.userLib.config.colors.suc).setTitle('Все роли, созданные интеграциями, были успешно удалены!');
	return msg.channel.send(embed);
};