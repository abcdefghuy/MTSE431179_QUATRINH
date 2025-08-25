import { QueryInterface, DataTypes } from 'sequelize';
interface Migration {
    up(queryInterface: QueryInterface, Sequelize: typeof DataTypes): Promise<void>;
    down(queryInterface: QueryInterface, Sequelize: typeof DataTypes): Promise<void>;
}
declare const migration: Migration;
export default migration;
