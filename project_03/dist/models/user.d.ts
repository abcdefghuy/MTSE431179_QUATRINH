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
interface UserCreationAttributes extends Omit<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {
}
declare class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    id: number;
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
    readonly createdAt: Date;
    readonly updatedAt: Date;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any): void;
}
declare const initUser: (sequelize: Sequelize, dataTypes: typeof DataTypes) => typeof User;
export default initUser;
