import { DataTypes, Model } from 'sequelize';

export default class User extends Model {
	static initialize(sequelize) {
		User.init(
			{
				id: { type: DataTypes.STRING, primaryKey: true },

				lvl: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
				xp: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },

				bits: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 100 },
				sdcoins: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 100 },
				caps: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 100 },
			},
			{
				sequelize,
				modelName: 'User',
				tableName: 'users',
			}
		);
	}
}
