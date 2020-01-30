module.exports = (client, member) => {
    client.userLib.sendLogChannel("memberRemove", member.guild, { user: { tag: member.user.tag, id: member.id, avatar: member.user.displayAvatarURL, joinedAt: member.joinedAt}});
};