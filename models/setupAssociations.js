import { models } from './index.js';
const { Guild, User, Warn } = models;

export default function () {
	Warn.belongsTo(Guild, { foreignKey: { name: 'guildId', allowNull: false }, as: 'guild' });
	Guild.hasMany(Warn, { foreignKey: { name: 'guildId', allowNull: false }, as: 'warns' });

	Warn.belongsTo(User, { foreignKey: { name: 'userId', allowNull: false }, as: 'user' });
	User.hasMany(Warn, { foreignKey: { name: 'userId', allowNull: false }, as: 'warns' });

	Warn.belongsTo(User, { foreignKey: { name: 'whoId', allowNull: false }, as: 'who' });
	User.hasMany(Warn, { foreignKey: { name: 'whoId', allowNull: false }, as: 'whoWarns' });
}
