let embed;

module.exports = async (client, oldMember, newMember) => {
    if (!oldMember.voiceChannel) {

      client.userLib.sendLogChannel("voiceStateAdd", newMember.guild, {user: {
        tag: oldMember.user.tag,
        id: oldMember.id,
        avatar: oldMember.user.displayAvatarURL,
        voice: newMember.voiceChannel
      }});

    };
    if (!newMember.voiceChannel) {

      client.userLib.sendLogChannel("voiceStateRemove", oldMember.guild, {user: {
        tag: oldMember.user.tag,
        id: oldMember.id,
        avatar: oldMember.user.displayAvatarURL,
        voice: oldMember.voiceChannel
      }});

    };

    if (oldMember.voiceChannel && newMember.voiceChannel) {

      client.userLib.sendLogChannel("voiceStateUpdate", oldMember.guild, {user: {
        tag: oldMember.user.tag,
        id: oldMember.id,
        avatar: oldMember.user.displayAvatarURL,
        voice: {
          oldName: oldMember.voiceChannel.name,
          newName: newMember.voiceChannel.name
        }
      }});
      
    }
};