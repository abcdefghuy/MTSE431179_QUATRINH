import express from 'express';
import homeController from '../controller/homeController';

let router = express.Router();


let initWebRoutes = (app) => {
    router.get('/', (req,res) =>{
        return res.send('Nguyen Sang Huy')
    });
    // Gọi hàm trong controller
    router.get('/home', homeController.getHomePage);        // GET /home
    router.get('/about', homeController.getAboutPage);      // GET /about
    router.get('/crud', homeController.getCRUD);            // GET /crud (trang CRUD)

    // CRUD
    router.post('/post-crud', homeController.postCRUD);     // POST: tạo mới
    router.get('/get-crud', homeController.getFindAllCRUD); // GET: lấy tất cả
    router.get('/edit-crud', homeController.getEditCRUD);   // GET: trang edit
    router.post('/put-crud', homeController.putCRUD);       // POST: update
    router.get('/delete-crud', homeController.deleteCRUD); 
    return app.use('/', router);
}
module.exports = initWebRoutes;

