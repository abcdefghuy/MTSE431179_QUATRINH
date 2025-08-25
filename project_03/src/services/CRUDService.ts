
import bcrypt from "bcryptjs";
import db from "../models/index";

const salt = bcrypt.genSaltSync(10);

interface UserData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    address: string;
    phoneNumber: string;
    gender: string;
    roleId: string;
    id?: string;
}

const createNewUser = async (data: UserData): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPassword,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                gender: data.gender === '1'? true : false,
                roleId: data.roleId,
            });
            resolve("Create user successfully!");
        } catch (error) {
            reject(error);
        }
    });
}

const hashUserPassword = (password: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (error) {
            reject(error);
        }
    });
}

const getAllUsers = (): Promise<any[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                raw: true
            });
            resolve(users);
        } catch (error) {
            reject(error);
        }
    });
}

const getUserById = (userId: string): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                raw: true
            });
            if (!user) {
                resolve([]);
            }
            resolve(user);
        } catch (error) {
            reject(error);
        }
    });
}

const updateUserData = (data: UserData): Promise<any[] | string> => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id }
            });
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                await user.save();
                let allUser = await getAllUsers();
                resolve(allUser);
            } else {
                resolve("User not found!");
            }
        } catch (error) {
            reject(error);
        }
    });
}

const deleteUserById = (userId: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId }
            });
            if (user) {
                await user.destroy();
                resolve("Delete user successfully!");
            } else {
                resolve("User not found!");
            }
        } catch (error) {
            reject(error);
        }
    });
}

export default {
    createNewUser,
    getAllUsers,
    getUserById,
    updateUserData,
    deleteUserById
};
