require('dotenv').config();

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

const config: Config = {
  development: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME_DEV || 'database_development',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: (process.env.DB_DIALECT || 'mysql') as Dialect,
    logging: console.log, // Enable SQL logging in development
    define: {
      freezeTableName: true,
      timestamps: true
    }
  },
  test: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME_TEST || 'database_test',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: (process.env.DB_DIALECT || 'mysql') as Dialect,
    logging: false, // Disable logging in test
    define: {
      freezeTableName: true,
      timestamps: true
    }
  },
  production: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME_PROD || 'database_production',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: (process.env.DB_DIALECT || 'mysql') as Dialect,
    logging: false, // Disable logging in production
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      freezeTableName: true,
      timestamps: true
    }
  }
};

export default config;
module.exports = config;
