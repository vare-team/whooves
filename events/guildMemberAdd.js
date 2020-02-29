module.exports = async (client, member) => {
    if (await client.userLib.settingsCheck(member.guild.id, client.userLib.settings.usernameChecker) && member.manageable && client.userLib.usernameCorrector(member.displayName)) {
        member.send(`На сервере "**${member.guild.name}**" ваше имя "**${member.displayName}**" было изменено на **${client.userLib.usernameCorrector(member.displayName)}**, в связи с запретом на не стандартные символы.\nДля его изменения обратитесь к администрации сервера.`);
        member.edit({nick: client.userLib.usernameCorrector(member.displayName)});
    }

    client.userLib.sendLogChannel("memberAdd", member.guild, {user: { tag: member.user.tag, id: member.id, createdAt: member.user.createdAt, avatar: member.user.displayAvatarURL }});
};
