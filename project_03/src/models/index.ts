import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import configModule from '../config/config';

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = configModule[env as keyof typeof configModule];
const db: { [key: string]: any } = {};

let sequelize: Sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable] as string, {
    host: config.host,
    dialect: config.dialect,
    logging: config.logging,
    pool: config.pool,
    define: config.define
  });
} else {
  sequelize = new Sequelize(config.database, config.username, config.password || undefined, {
    host: config.host,
    dialect: config.dialect,
    logging: config.logging,
    pool: config.pool,
    define: config.define
  });
}

fs
  .readdirSync(__dirname)
  .filter((file: string) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      (file.slice(-3) === '.ts' || file.slice(-3) === '.js') &&
      file.indexOf('.test.') === -1
    );
  })
  .forEach((file: string) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName: string) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
