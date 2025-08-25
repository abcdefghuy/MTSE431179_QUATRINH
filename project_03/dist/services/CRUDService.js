"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const index_1 = __importDefault(require("../models/index"));
const salt = bcryptjs_1.default.genSaltSync(10);
const createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await hashUserPassword(data.password);
            await index_1.default.User.create({
                email: data.email,
                password: hashPassword,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId,
            });
            resolve("Create user successfully!");
        }
        catch (error) {
            reject(error);
        }
    });
};
const hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcryptjs_1.default.hashSync(password, salt);
            resolve(hashPassword);
        }
        catch (error) {
            reject(error);
        }
    });
};
const getAllUsers = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await index_1.default.User.findAll({
                raw: true
            });
            resolve(users);
        }
        catch (error) {
            reject(error);
        }
    });
};
const getUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await index_1.default.User.findOne({
                where: { id: userId },
                raw: true
            });
            if (!user) {
                resolve([]);
            }
            resolve(user);
        }
        catch (error) {
            reject(error);
        }
    });
};
const updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await index_1.default.User.findOne({
                where: { id: data.id }
            });
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                await user.save();
                let allUser = await getAllUsers();
                resolve(allUser);
            }
            else {
                resolve("User not found!");
            }
        }
        catch (error) {
            reject(error);
        }
    });
};
const deleteUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await index_1.default.User.findOne({
                where: { id: userId }
            });
            if (user) {
                await user.destroy();
                resolve("Delete user successfully!");
            }
            else {
                resolve("User not found!");
            }
        }
        catch (error) {
            reject(error);
        }
    });
};
exports.default = {
    createNewUser,
    getAllUsers,
    getUserById,
    updateUserData,
    deleteUserById
};
//# sourceMappingURL=CRUDService.js.map