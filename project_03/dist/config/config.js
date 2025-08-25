"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    development: {
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || null,
        database: process.env.DB_NAME_DEV || 'database_development',
        host: process.env.DB_HOST || '127.0.0.1',
        dialect: (process.env.DB_DIALECT || 'mysql'),
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
        dialect: (process.env.DB_DIALECT || 'mysql'),
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
        dialect: (process.env.DB_DIALECT || 'mysql'),
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
exports.default = config;
//# sourceMappingURL=config.js.map