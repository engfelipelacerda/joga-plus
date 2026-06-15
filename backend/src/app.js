import express from 'express';
import dotenv from 'dotenv';

import connection from './database/connection.js';
import tables from './database/tables.js';
import router from './routes/routes.js';
import errorHandler from './middlewares/errorHandler.js';

dotenv.config();

const app = express(); // atribuir a variável app para usar o express;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', router);

app.use(errorHandler);

tables.init(connection);

export default app;
