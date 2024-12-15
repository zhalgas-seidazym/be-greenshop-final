import {hashPassword, validatePassword} from "../../infrastructure/utils/bcrypt.js";
import {jwtEncode} from "../../infrastructure/utils/jwt.js";

class UserController {
    constructor(userRepository, redisRepository) {
        this.userRepository = userRepository;
        this.redisRepository = redisRepository;
    }

    async signIn(req, res) {
        const {email, password} = req.body;
        try {
            const dbUser = await this.userRepository.findByEmail(email);
            if (!dbUser) {
                return res.status(401).send({"detail": "User Not Found"});
            }
            if (!validatePassword(password, dbUser.password)) {
                return res.status(401).send({"detail": "Password is incorrect"});
            }

            const payload = {userId: dbUser.id};
            const accessToken = jwtEncode(payload);
            const refreshToken = jwtEncode(payload, '7d');

            return res.status(200).send({accessToken, refreshToken});
        } catch (err) {
            console.error(err);
            return res.status(500).send({"detail": "Internal Server Error"});
        }
    }

    async signUp(req, res) {
        const {firstName, lastName, email, password} = req.body;
        try {
            let existingUser = await this.userRepository.findByEmail(email);
            if (existingUser) {
                return res.status(400).send({"detail": "Email already in use"});
            }

            const hashedPassword = await hashPassword(password);
            const newUser = {firstName, lastName, email, password: hashedPassword};

            const createdUser = await this.userRepository.create(newUser);

            const payload = {userId: createdUser.id};
            const accessToken = jwtEncode(payload);
            const refreshToken = jwtEncode(payload, '7d');

            return res.status(201).send({accessToken, refreshToken});
        } catch (err) {
            console.log(err)
            return res.status(500).send({"detail": "Internal Server Error"});
        }
    }

    async forgetPassword(req, res) {
        const {email} = req.body;
        try {
            const existingUser = await this.userRepository.findByEmail(email);
            if (!existingUser) {
                return res.status(404).send({"detail": "User not found"});
            }

            // TODO: Implement the logic for sending a reset OTP/email here

            return res.status(200).send({"detail": "Reset instructions sent"});
        } catch (err) {
            return res.status(500).send({"detail": "Internal Server Error"});
        }
    }

    async verifyOtp(req, res) {
        const {code} = req.body;
        try {
            const otp = await this.redisRepository.get(code);
            if (!otp) {
                return res.status(404).send({"detail": "Expired or not found"});
            }

            // TODO: Implement OTP verification logic and password reset flow here

            return res.status(200).send({"detail": "OTP verified successfully"});
        } catch (err) {
            return res.status(500).send({"detail": "Internal Server Error"});
        }
    }


    async profile(req, res) {
        const user = req.user;

        try {
            return res.status(200).send({
                "firstName": user.firstName,
                "lastName": user.lastName,
                "phoneNumber": user.phoneNumber | "",
                "email": user.email,
                "photo_url": user.photoURL,
            });
        } catch (err) {
            return res.status(500).send({"detail": "Internal Server Error"});
        }
    }
}

export default UserController;
