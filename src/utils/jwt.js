import jwt from 'jsonwebtoken';
import config from '../main/config.js';

const jwtEncode = (payload, expiresIn = config.jwtExpires) => {
    return jwt.sign(payload, config.jwtSecret, {expiresIn: expiresIn});
};

const jwtDecode = (token) => {
    return jwt.verify(token, config.jwtSecret);
};

export {jwtEncode, jwtDecode};
