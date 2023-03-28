import { DataTypes, Model } from 'sequelize';

export default class Warn extends Model {
	static initialize(sequelize) {
		Warn.init(
			{
				reason: { type: DataTypes.TEXT },

				userId: { type: DataTypes.STRING },
				guildId: { type: DataTypes.STRING },
				whoId: { type: DataTypes.STRING },
			},
			{
				sequelize,
				modelName: 'Warn',
				tableName: 'warns',
			}
		);
	}
}
