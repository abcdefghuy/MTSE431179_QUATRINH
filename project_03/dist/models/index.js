"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sequelize_1 = require("sequelize");
const configdb_1 = require("../config/configdb"); // Sử dụng sequelize instance từ configdb
const basename = path_1.default.basename(__filename);
const db = {};
fs_1.default
    .readdirSync(__dirname)
    .filter((file) => {
    // Chỉ lấy file .js khi production, .ts khi dev, bỏ qua .d.ts
    const isDeclaration = file.endsWith('.d.ts');
    const isTest = file.indexOf('.test.') !== -1;
    const isHidden = file.indexOf('.') === 0;
    const isSelf = file === basename;
    const isJs = file.endsWith('.js');
    const isTs = file.endsWith('.ts');
    if (isDeclaration || isTest || isHidden || isSelf)
        return false;
    if (process.env.NODE_ENV === 'production') {
        return isJs;
    }
    else {
        return isTs || isJs;
    }
})
    .forEach((file) => {
    const imported = require(path_1.default.join(__dirname, file));
    // Nếu là module ES, lấy .default, còn lại lấy trực tiếp
    const modelFactory = imported.default || imported;
    if (typeof modelFactory === 'function') {
        const model = modelFactory(configdb_1.sequelize, sequelize_1.DataTypes);
        db[model.name] = model;
    }
});
Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});
db.sequelize = configdb_1.sequelize;
db.Sequelize = sequelize_1.Sequelize;
exports.default = db;
//# sourceMappingURL=index.js.map