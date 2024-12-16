import dotenv from 'dotenv';
import {fileURLToPath} from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BaseDir = path.resolve(__dirname, '..', '..');
const MediaDir = path.resolve(BaseDir, 'media');

dotenv.config({path: path.join(BaseDir, '.env')});


export default {
    mongodb: process.env.MONGODB_URI,
    port: process.env.PORT,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpires: process.env.JWT_EXPIRES,
    redisHost: process.env.REDIS_HOST,
    redisDatabase: process.env.REDIS_DATABASE,
    redisPort: process.env.REDIS_PORT,
    redisPassword: process.env.REDIS_PASSWORD,
    rootEmail: process.env.ROOT_EMAIL,
    rootEmailPass: process.env.ROOT_EMAIL_PASS,
}

export {BaseDir, MediaDir}