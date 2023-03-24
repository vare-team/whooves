import { DataTypes, Model } from 'sequelize';

export default class Guild extends Model {
	static initialize(sequelize) {
		Guild.init(
			{
				id: { type: DataTypes.STRING, primaryKey: true },

				settings: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
				currency: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },

				logChannel: { type: DataTypes.STRING },
				mutedRole: { type: DataTypes.STRING },
			},
			{
				sequelize,
				modelName: 'Guild',
				tableName: 'guilds',
			}
		);
	}
}
