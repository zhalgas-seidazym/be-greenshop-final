import {jwtDecode} from "../utils/jwt.js";
import UserRepository from "../infrastructure/repositories/user-repository.js";

const isAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({"detail": "Not authorized"});
        }
        const {userId} = jwtDecode(token);
        const userRepository = new UserRepository();
        const user = await userRepository.findById(userId);
        if (!user) {
            return res.status(401).json({"detail": "Not authorized"});
        }
        if (!user.verifiedUser) {
            return res.status(401).json({"detail": "User not verified"});
        }
        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({"detail": "Invalid token or unauthorized"});
    }
};

const isAdmin = async (req, res, next) => {
    try {
            const user = req.user;
        if (!user || user.role !== 'admin') {
            return res.status(403).json({detail: "Forbidden: Admin access required"});
        }

        next();
    } catch (err) {
        console.error(err);
        return res.status(403).json({detail: "Forbidden: Admin access required"});
    }
};


export {isAuth, isAdmin};
