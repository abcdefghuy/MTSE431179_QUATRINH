"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = exports.sequelize = exports.connectDb = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables FIRST
dotenv_1.default.config();
const sequelize_1 = require("sequelize");
// Create Sequelize instance with environment variables
const sequelize = new sequelize_1.Sequelize(process.env.DB_NAME_DEV || 'database_development', process.env.DB_USERNAME || 'root', process.env.DB_PASSWORD || '', {
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        freezeTableName: true,
        timestamps: true
    },
    dialectOptions: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
    }
});
exports.sequelize = sequelize;
// Connection function
const connectDb = async () => {
    try {
        await sequelize.authenticate();
        console.log(`✅ Database connection established successfully!`);
        console.log(`📊 Database: ${process.env.DB_NAME_DEV || 'database_development'}`);
        console.log(`🌐 Host: ${process.env.DB_HOST || '127.0.0.1'}`);
        console.log(`👤 User: ${process.env.DB_USERNAME || 'root'}`);
        console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('❌ Unable to connect to the database:', error.message);
        }
        else {
            console.error('❌ Unable to connect to the database:', error);
        }
        console.error('🔧 Please check your database configuration in .env file');
        console.error('📋 Required environment variables:');
        console.error('   - DB_USERNAME');
        console.error('   - DB_PASSWORD');
        console.error('   - DB_NAME_DEV');
        console.error('   - DB_HOST');
        process.exit(1);
    }
};
exports.connectDb = connectDb;
// Test database connection
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('🔍 Database connection test passed!');
        return true;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('🔍 Database connection test failed:', error.message);
        }
        else {
            console.error('🔍 Database connection test failed:', String(error));
        }
        return false;
    }
};
exports.testConnection = testConnection;
exports.default = connectDb;
//# sourceMappingURL=configdb.js.map