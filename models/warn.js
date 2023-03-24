import { DataTypes, Model } from 'sequelize';

export default class Warn extends Model {
	static initialize(sequelize) {
		Warn.init(
			{
				reason: { type: DataTypes.TEXT },
			},
			{
				sequelize,
				modelName: 'Warn',
				tableName: 'warns',
			}
		);
	}
}
