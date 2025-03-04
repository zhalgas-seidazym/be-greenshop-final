import jwt from 'jsonwebtoken';
import config from '../main/config.js';

const jwtEncode = (payload, expiresIn = config.jwtExpires) => {
    try {
        return jwt.sign(payload, config.jwtSecret, {expiresIn: expiresIn});
    } catch (err) {
        throw new Error("Error generating token");
    }
};

const jwtDecode = (token) => {
    try {
        return jwt.verify(token, config.jwtSecret);
    } catch (err) {
        throw new Error("Invalid or expired token");
    }
};

export {jwtEncode, jwtDecode};
