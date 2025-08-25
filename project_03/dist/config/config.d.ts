import { Dialect } from 'sequelize';
interface DatabaseConfig {
    username: string;
    password: string | null | undefined;
    database: string;
    host: string;
    dialect: Dialect;
    use_env_variable?: string;
    logging?: boolean | ((sql: string) => void);
    pool?: {
        max: number;
        min: number;
        acquire: number;
        idle: number;
    };
    define?: {
        freezeTableName: boolean;
        timestamps: boolean;
    };
}
interface Config {
    development: DatabaseConfig;
    test: DatabaseConfig;
    production: DatabaseConfig;
}
declare const config: Config;
export default config;
