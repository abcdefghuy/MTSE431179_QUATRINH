import { Request, Response } from 'express';
import db from '../models/index';
import CRUD from '../services/CRUDService';

const getHomePage = async (req: Request, res: Response): Promise<void> => {
    try {
        let data = await CRUD.getAllUsers();
        res.render('homepage.ejs', { data: JSON.stringify(data) });
    } catch (error) {
        console.log(error);
        res.send('Error from server');
    }
}

const getAboutPage = (req: Request, res: Response): void => {
    res.render('about.ejs');
}

const getCRUD = (req: Request, res: Response): void => {
    res.render('crud.ejs');
}
const getFindAllCRUD = async (req: Request, res: Response): Promise<void> => {
    try {
        let data = await CRUD.getAllUsers();
        res.render('users/findAllUser.ejs', { datalist: data });
    } catch (error) {
        console.log(error);
        res.send('Error from server');
    }
}

const getEditCRUD = async (req: Request, res: Response): Promise<void> => {
    try {
        let userId = req.query.id;
        if (!userId) {
            res.send('User not found!');
            return;
        }
        let user = await CRUD.getUserById(userId as string);
        res.render('users/updateUser.ejs', {data: user });
    } catch (error) {
        console.log(error);
        res.send('Error from server');
    }
}

const postCRUD = async (req: Request, res: Response): Promise<void> => {
    try {
        let userData = req.body;
        let result = await CRUD.createNewUser(userData);
        res.redirect('/get-crud?created=success');
    } catch (error) {
        console.log(error);
        res.redirect('/get-crud?created=error');
    }
}

const putCRUD = async (req: Request, res: Response): Promise<void> => {
    try {
        let userData = req.body;
        let result = await CRUD.updateUserData(userData);
        res.redirect('/get-crud?updated=success');
    } catch (error) {
        console.log(error);
        res.redirect('/get-crud?updated=error');
    }
}

const deleteCRUD = async (req: Request, res: Response): Promise<void> => {
    try {
        let userId = req.query.id;
        await CRUD.deleteUserById(userId as string);
        res.redirect('/get-crud?deleted=success');
    } catch (error) {
        console.log(error);
        res.redirect('/get-crud?deleted=error');
    }
}

export default {
    getHomePage,
    getAboutPage,
    getCRUD,
    getFindAllCRUD,
    getEditCRUD,
    postCRUD,
    putCRUD,
    deleteCRUD
};
