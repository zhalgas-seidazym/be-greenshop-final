import path from "path";
import morgan from "morgan";
import express from 'express';
import * as fs from "node:fs";
import swaggerUi from "swagger-ui-express";


import connectToDB from "../infrastructure/database/mongoose.js";
import config, {BaseDir} from "./config.js";
import globalRouter from '../interface/global-routers.js'
import bodyParser from "body-parser";

const app = express();
const swaggerJsonPath = path.resolve('swagger_output.json');
const swaggerFile = JSON.parse(fs.readFileSync(swaggerJsonPath, 'utf-8'));


connectToDB();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser());


app.use("/api", globalRouter)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use('/uploads', express.static(path.join(BaseDir, 'uploads')));

app.use(morgan('combined'));

app.listen(config.port, () => {
    console.log(`App listening on http://localhost:${config.port}`);
});