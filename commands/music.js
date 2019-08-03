const radios = require('../sounds/radios.json');

exports.help = {
    name: "music",
    description: "Музыка",
    usage: "music [play/stop/rd]",
    flag: 0,
    cooldown: 5000
};

exports.run = (client, msg, args, Discord) => {
	if (!msg.member.voiceChannel) return msg.reply("Нужно быть в голосовом канале");

	switch (args[1]) {
		case "vol":
			if (!args[2]) msg.reply("Громкость не указана");
			msg.guild.voiceConnection.dispatcher.setVolume(args[2]/100);
			msg.reply("Громкость изменена");
			break;
		case "stop":
			if (!msg.guild.voiceConnection) return msg.reply('Я не в голосовом канале.');
			const dispatcher_lv = msg.guild.voiceConnection.playFile('./sounds/gg.wav');
			dispatcher_lv.on('end', () => msg.member.voiceChannel.leave());
			break;
		case "rd":
			if (!args[2]) msg.reply("Радиостанция не указана");
			let http_rd;
			let speach;
			let err = 0;
			switch (args[2]) {
				case 'юморфм':
					http_rd = radios.humor_fm; speach = "s_hmf";
					break;
				case 'аторадио':
					http_rd = radios.autoradio; speach = "s_ar";
					break;
				case 'русскоерадио':
					http_rd = radios.rusradio; speach = "s_rr";
					break;
				case 'дорожноерадио':
					http_rd = radios.dorognoeradio; speach = "s_dr";
					break;
				case 'европаплюс':
					http_rd = radios.europa_plus; speach = "s_ep";
					break;
				default:
					err = 1; speach ="err";
					break;
			}
			msg.member.voiceChannel.join().then(connection => {
			    let dispatcher = connection.playFile('./sounds/' + speach + ".wav");
			    dispatcher.setVolume(1);
			    dispatcher.on('end', () => {if (err) connection.channel.leave(); else dispatcher = connection.playArbitraryInput(http_rd); dispatcher.setVolume(0.1);});
			});
			break;
		case "tts":
			msg.member.voiceChannel.join().then(connection => {
			    let dispatcher = connection.playFile('./sounds/' + args[2]);
			    dispatcher.setVolume(1);
			    dispatcher.on('end', () => {connection.channel.leave();});
			});
			break;
		case "sd":
			break;
	}
};