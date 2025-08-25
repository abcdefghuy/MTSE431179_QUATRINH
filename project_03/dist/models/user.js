"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class User extends sequelize_1.Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // định nghĩa mối quan hệ
    }
}
const initUser = (sequelize, dataTypes) => {
    User.init({
        email: dataTypes.STRING,
        password: dataTypes.STRING,
        firstName: dataTypes.STRING,
        lastName: dataTypes.STRING,
        address: dataTypes.STRING,
        phoneNumber: dataTypes.STRING,
        gender: dataTypes.BOOLEAN,
        image: dataTypes.STRING,
        roleId: dataTypes.STRING,
        positionId: dataTypes.STRING
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'users', // Chỉ định rõ tên bảng
        freezeTableName: true // Không tự động thay đổi tên bảng
    });
    return User;
};
exports.default = initUser;
//# sourceMappingURL=user.js.map