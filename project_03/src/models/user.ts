import { Model, DataTypes, Sequelize } from 'sequelize';

interface UserAttributes {
  id?: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  gender: boolean;
  image?: string;
  roleId: string;
  positionId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Omit<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public password!: string;
  public firstName!: string;
  public lastName!: string;
  public address!: string;
  public phoneNumber!: string;
  public gender!: boolean;
  public image?: string;
  public roleId!: string;
  public positionId?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models: any): void {
    // định nghĩa mối quan hệ
  }
}


const initUser = (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  User.init({
    email: dataTypes.STRING,
    password: dataTypes.STRING,
    firstName: dataTypes.STRING,
    lastName: dataTypes.STRING,
    address: dataTypes.STRING,
    phoneNumber: dataTypes.STRING,
    gender: dataTypes.BOOLEAN,
    image: dataTypes.STRING,
    roleId: dataTypes.STRING,
    positionId: dataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',  // Chỉ định rõ tên bảng
    freezeTableName: true  // Không tự động thay đổi tên bảng
  });
  return User;
};

export default initUser;
