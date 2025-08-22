import db from '../models/index.js';
import CRUD from '../services/CRUDService.js';
let getHomePage = async (req, res) => {
    try {
        let data = await CRUD.getAllUsers();
        return res.render('homepage.ejs', { data: JSON.stringify(data) });
    } catch (error) {
        console.log(error);
        return res.send('Error from server');
    }
}

let getAboutPage = (req, res) => {
    return res.render('about.ejs');
}
let getCRUD = (req, res) => {
    return res.render('crud.ejs');
}
let getFindAllCRUD = async (req, res) => {
    try {
        let data = await CRUD.getAllUsers();
        return res.render('users/findAllUser.ejs', { datalist: data });
    } catch (error) {
        console.log(error);
        return res.send('Error from server');
    }
}
let getEditCRUD = async (req, res) => {
    try {
        let userId = req.query.id;
        if (!userId) {
            return res.send('User not found!');
        }
        let user = await CRUD.getUserById(userId);
        return res.render('users/updateUser.ejs', {data: user });
    } catch (error) {
        console.log(error);
        return res.send('Error from server');
    }
}

let postCRUD = async (req, res) => {
    try {
        let userData = req.body;
        let result = await CRUD.createNewUser(userData);
        return res.redirect('/get-crud?created=success');
    } catch (error) {
        console.log(error);
        return res.redirect('/get-crud?created=error');
    }
}
let putCRUD = async (req, res) => {
    try {
        let userData = req.body;
        let result = await CRUD.updateUserData(userData);
        return res.redirect('/get-crud?updated=success');
    } catch (error) {
        console.log(error);
        return res.redirect('/get-crud?updated=error');
    }
}
let deleteCRUD = async (req, res) => {
    try {
        let userId = req.query.id;
        await CRUD.deleteUserById(userId);
        return res.redirect('/get-crud?deleted=success');
    } catch (error) {
        console.log(error);
        return res.redirect('/get-crud?deleted=error');
    }
}

module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    getFindAllCRUD: getFindAllCRUD,
    getEditCRUD: getEditCRUD,
    postCRUD: postCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD
};
