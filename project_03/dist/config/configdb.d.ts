import { Sequelize } from 'sequelize';
declare const sequelize: Sequelize;
declare const connectDb: () => Promise<void>;
declare const testConnection: () => Promise<boolean>;
export { connectDb, sequelize, testConnection };
export default connectDb;
