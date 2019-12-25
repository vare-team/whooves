module.exports = (client) => {
  client.userLib.sc.registerTask({code: 'presense', execute: client.userLib.presenseFunc});
  client.userLib.sc.registerTask({code: 'unCooldown', execute: (times, id) => times.delete(id)});
  client.userLib.presenseFunc();
  client.userLib.sendLog(`Whooves is ready!`);
};