import express from 'express';
import config from "./config.js";
import connectToDB from "../infrastructure/database/mongoose.js";
import swaggerUi from "swagger-ui-express";
import path from "path";
import * as fs from "node:fs";
import globalRouter from '../interface/global.js'
import morgan from "morgan";

const app = express();
const swaggerJsonPath = path.resolve('swagger_output.json');
const swaggerFile = JSON.parse(fs.readFileSync(swaggerJsonPath, 'utf-8'));


connectToDB();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/api", globalRouter)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(morgan('combined'));

app.listen(config.port, () => {
    console.log(`App listening on http://localhost:${config.port}`);
});