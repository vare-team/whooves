module.exports = (client, member) => {
    client.userLib.sendLogChannel("memberAdd", member.guild, {user: { tag: member.user.tag, id: member.id, createdAt: member.user.createdAt, avatar: member.user.displayAvatarURL }});
};
