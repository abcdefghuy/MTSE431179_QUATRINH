"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CRUDService_1 = __importDefault(require("../services/CRUDService"));
const getHomePage = async (req, res) => {
    try {
        let data = await CRUDService_1.default.getAllUsers();
        res.render('homepage.ejs', { data: JSON.stringify(data) });
    }
    catch (error) {
        console.log(error);
        res.send('Error from server');
    }
};
const getAboutPage = (req, res) => {
    res.render('about.ejs');
};
const getCRUD = (req, res) => {
    res.render('crud.ejs');
};
const getFindAllCRUD = async (req, res) => {
    try {
        let data = await CRUDService_1.default.getAllUsers();
        res.render('users/findAllUser.ejs', { datalist: data });
    }
    catch (error) {
        console.log(error);
        res.send('Error from server');
    }
};
const getEditCRUD = async (req, res) => {
    try {
        let userId = req.query.id;
        if (!userId) {
            res.send('User not found!');
            return;
        }
        let user = await CRUDService_1.default.getUserById(userId);
        res.render('users/updateUser.ejs', { data: user });
    }
    catch (error) {
        console.log(error);
        res.send('Error from server');
    }
};
const postCRUD = async (req, res) => {
    try {
        let userData = req.body;
        let result = await CRUDService_1.default.createNewUser(userData);
        res.redirect('/get-crud?created=success');
    }
    catch (error) {
        console.log(error);
        res.redirect('/get-crud?created=error');
    }
};
const putCRUD = async (req, res) => {
    try {
        let userData = req.body;
        let result = await CRUDService_1.default.updateUserData(userData);
        res.redirect('/get-crud?updated=success');
    }
    catch (error) {
        console.log(error);
        res.redirect('/get-crud?updated=error');
    }
};
const deleteCRUD = async (req, res) => {
    try {
        let userId = req.query.id;
        await CRUDService_1.default.deleteUserById(userId);
        res.redirect('/get-crud?deleted=success');
    }
    catch (error) {
        console.log(error);
        res.redirect('/get-crud?deleted=error');
    }
};
exports.default = {
    getHomePage,
    getAboutPage,
    getCRUD,
    getFindAllCRUD,
    getEditCRUD,
    postCRUD,
    putCRUD,
    deleteCRUD
};
//# sourceMappingURL=homeController.js.map