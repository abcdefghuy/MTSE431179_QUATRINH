import dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';
import bodyParser from 'body-parser';
import viewEngine from './config/viewEngine';
import initWebRoutes from './route/web';
import connectDb from './config/configdb';

const app: Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
viewEngine(app);
initWebRoutes(app);
connectDb();

const port: number = parseInt(process.env.PORT as string) || 8080;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
