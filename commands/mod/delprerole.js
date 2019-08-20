
exports.help = {
    name: "delprerole",
    description: "Удаляет все роли, созданные интеграцией\n**Роль AKin'а должна быть выше всех!**",
    usage: "delprerole",
    flag: 1,
    cooldown: 10000
}

exports.run = async (client, msg, args) => {

	let count, i;

	await msg.guild.roles.forEach((role)=>{if (role.managed) count += 1;});
	await msg.guild.roles.forEach((role)=>{if (role.managed) {role.delete('Автогенерируемая роль'); i++;}});

	embed = new client.discord.RichEmbed().setColor(client.config.colors.err).setTitle('Ошибка!').setDescription(`Не возможно удалить роль так как не хватает прав!\n**Роль AKin'а должна быть выше всех!**`)
  		
	if (i == count) embed = new client.discord.RichEmbed().setColor(client.config.colors.suc).setTitle('Все роли, созданные интеграциями, были успешно удалены!')

	msg.channel.send({embed});

};