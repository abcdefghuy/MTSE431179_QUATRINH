"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const homeController_1 = __importDefault(require("../controller/homeController"));
const router = express_1.default.Router();
const initWebRoutes = (app) => {
    router.get('/', (req, res) => {
        return res.send('Nguyen Sang Huy');
    });
    // Gọi hàm trong controller
    router.get('/home', homeController_1.default.getHomePage); // GET /home
    router.get('/about', homeController_1.default.getAboutPage); // GET /about
    router.get('/crud', homeController_1.default.getCRUD); // GET /crud (trang CRUD)
    // CRUD
    router.post('/post-crud', homeController_1.default.postCRUD); // POST: tạo mới
    router.get('/get-crud', homeController_1.default.getFindAllCRUD); // GET: lấy tất cả
    router.get('/edit-crud', homeController_1.default.getEditCRUD); // GET: trang edit
    router.post('/put-crud', homeController_1.default.putCRUD); // POST: update
    router.get('/delete-crud', homeController_1.default.deleteCRUD);
    app.use('/', router);
};
exports.default = initWebRoutes;
//# sourceMappingURL=web.js.map