module.exports = async (client, oldMember, newMember) => {
    if (!oldMember.voiceChannel) {
      client.userLib.sendLogChannel("voiceStateAdd", newMember.guild, { user: { tag: oldMember.user.tag, id: oldMember.id, avatar: oldMember.user.displayAvatarURL }, channel: { name: newMember.voiceChannel.name }});
    }

    if (!newMember.voiceChannel) {
      client.userLib.sendLogChannel("voiceStateRemove", oldMember.guild, {user: { tag: oldMember.user.tag, id: oldMember.id, avatar: oldMember.user.displayAvatarURL }, channel: { name: oldMember.voiceChannel.name }});
    }

    if ((oldMember.voiceChannel && newMember.voiceChannel) && oldMember.voiceChannel.id != newMember.voiceChannel.id) {
      client.userLib.sendLogChannel("voiceStateUpdate", oldMember.guild, { user: { tag: oldMember.user.tag, id: oldMember.id, avatar: oldMember.user.displayAvatarURL }, channel: { oldName: oldMember.voiceChannel.name, newName: newMember.voiceChannel.name }});
    }
};