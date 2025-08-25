import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config();

import { Sequelize } from 'sequelize';

// Create Sequelize instance with environment variables
const sequelize = new Sequelize(
    process.env.DB_NAME_DEV || 'database_development', 
    process.env.DB_USERNAME || 'root', 
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || '127.0.0.1',
        dialect: (process.env.DB_DIALECT as any as import('sequelize').Dialect) || 'mysql',
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
    }
);

// Connection function
const connectDb = async () => {
    try {
        await sequelize.authenticate();
        console.log(`✅ Database connection established successfully!`);
        console.log(`📊 Database: ${process.env.DB_NAME_DEV || 'database_development'}`);
        console.log(`🌐 Host: ${process.env.DB_HOST || '127.0.0.1'}`);
        console.log(`👤 User: ${process.env.DB_USERNAME || 'root'}`);
        console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
    } catch (error) {
        if (error instanceof Error) {
            console.error('❌ Unable to connect to the database:', error.message);
        } else {
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

// Test database connection
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('🔍 Database connection test passed!');
        return true;
    } catch (error) {
        if (error instanceof Error) {
            console.error('🔍 Database connection test failed:', error.message);
        } else {
            console.error('🔍 Database connection test failed:', String(error));
        }
        return false;
    }
};

// Export using ES6 syntax
export { connectDb, sequelize, testConnection };
export default connectDb;