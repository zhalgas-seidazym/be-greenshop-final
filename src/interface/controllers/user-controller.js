import {hashPassword, validatePassword} from "../../utils/bcrypt.js";
import {jwtDecode, jwtEncode} from "../../utils/jwt.js";
import crypto from "crypto";

class UserController {
    constructor(userRepository, redisService, emailService) {
        this.userRepository = userRepository;
        this.redisService = redisService;
        this.emailService = emailService;

    }

    async signIn(req, res) {
        const {email, password} = req.body;
        try {
            const dbUser = await this.userRepository.findByEmail(email);
            if (!dbUser) {
                return res.status(401).send({"detail": "User Not Found"});
            }
            const isPasswordValid = await validatePassword(password, dbUser.password);
            if (!isPasswordValid) {
                return res.status(401).send({"detail": "Password is incorrect"});
            }

            const payload = {userId: dbUser.id};
            const accessToken = jwtEncode(payload);
            const refreshToken = jwtEncode(payload, '7d');

            return res.status(200).send({accessToken, refreshToken, role: dbUser.role});
        } catch (err) {
            console.error(err);
            return res.status(500).send({"detail": "Internal Server Error"});
        }
    }

    async signUp(req, res) {
        const {firstName, lastName, email, password, role} = req.body;
        try {
            let existingUser = await this.userRepository.findByEmail(email);
            if (existingUser) {
                return res.status(400).send({"detail": "Email already in use"});
            }

            const hashedPassword = await hashPassword(password);
            let newUser = {firstName, lastName, email, role, password: hashedPassword};
            try {
                await this.userRepository.create(newUser);
            } catch (err) {
                return res.status(400).send({"detail": err.message});
            }

            return res.status(201).send({"detail": "User successfully signed up"});
        } catch (err) {
            console.log(err)
            return res.status(500).send({"detail": "Internal Server Error"});
        }
    }

    async checkPhoneNumber(req, res) {
        const {phoneNumber} = req.body;
        try {
            return await this.userRepository.findByPhoneNumber(phoneNumber) !== null;
        } catch (err) {
            console.log(err)
            return res.status(500).send({"detail": "Internal Server Error"});
        }

    }

    async sendVerificationToEmail(req, res) {
        const {email} = req.body;
        let {redirect_url} = req.query;

        try {
            const existingUser = await this.userRepository.findByEmail(email);
            if (!existingUser) {
                return res.status(404).json({detail: "Account with this email not found"});
            }
            if (existingUser.verifiedUser) {
                return res.status(400).json({detail: "Already verified"});
            }

            const resetToken = crypto.randomBytes(32).toString('hex');

            await this.redisService.set(
                `verify_email_token:${resetToken}`,
                email,
                900
            );
            redirect_url = redirect_url + "?token=" + resetToken;
            await this.emailService.sendVerifyEmail(email, redirect_url);

            return res.status(200).json({detail: "Account verification email successfully sent"});

        } catch (error) {
            console.error(error);
            return res.status(500).json({detail: "Internal server error"});
        }
    }

    async validateVerifyToken(req, res) {
        let {token} = req.query;
        try {
            const email = await this.redisService.get(`verify_email_token:${token}`);
            if (!email) {
                return res.status(404).json({detail: "Invalid or expired verification token"});

            } else {
                const user = await this.userRepository.findByEmail(email);
                if (!user) {
                    return res.status(404).json({detail: "User not found"});
                } else {
                    user.verifiedUser = true;
                    await this.userRepository.update(user.id, user);
                }
            }

            return res.status(200).json({detail: "User email successfully verified"})
        } catch (error) {
            console.error(error);
            return res.status(500).json({detail: "Internal server error"});
        }
    }

    async profile(req, res) {
        const user = req.user;

        try {
            return res.status(200).send({
                "firstName": user.firstName,
                "lastName": user.lastName,
                "phoneNumber": user.phoneNumber || "",
                "email": user.email,
                "photo_url": user.photoURL,
                "role": user.role,
            });
        } catch (err) {
            return res.status(500).send({"detail": "Internal Server Error"});
        }
    }

    async update_profile(req, res) {
        const {
            firstName = null,
            lastName = null,
            phoneNumber = null,
            email = null,
            currentPassword = null,
            password = null
        } = req.body;
        const profilePicture = req.file ? req.file.path : null;
        const user = req.user;
        try {
            const newData = {
                firstName: firstName || user.firstName,
                lastName: lastName || user.lastName,
                phoneNumber: phoneNumber || user.phoneNumber,
                email: email || user.email,
                ...(profilePicture && {photoURL: profilePicture}),
            };

            if (password) {
                if (!await validatePassword(currentPassword, user.password)) {
                    return res.status(400).send({detail: 'Password is incorrect'});
                }
                newData.password = await hashPassword(password);
            }

            const updatedUser = await this.userRepository.update(user.id, newData);

            if (!updatedUser) {
                return res.status(404).send({detail: 'User not found'});
            }

            return res.status(200).send({detail: 'Profile updated', user: updatedUser});
        } catch (err) {
            console.error(err);

            if (err.name === 'ValidationError') {
                return res.status(400).send({detail: 'Invalid data', errors: err.errors});
            }

            return res.status(500).send({detail: 'Internal Server Error'});
        }
    }

    async refreshToken(req, res) {
        const {refreshToken} = req.body;

        if (!refreshToken) {
            return res.status(400).send({detail: "Refresh token is required"});
        }
        let decoded;
        try {
            decoded = jwtDecode(refreshToken);
        } catch (err) {
            console.error("Error decoding refresh token:", err);
            return res.status(400).send({detail: "Invalid or expired refresh token"});
        }

        try {
            if (!decoded || !decoded.userId) {
                return res.status(401).send({detail: "Invalid or expired refresh token"});
            }

            const dbUser = await this.userRepository.findById(decoded.userId);
            if (!dbUser) {
                return res.status(404).send({detail: "User not found"});
            }

            const payload = {userId: dbUser.id};
            const accessToken = jwtEncode(payload);
            const newRefreshToken = jwtEncode(payload, '7d');  // Renamed variable

            return res.status(200).send({accessToken, refreshToken: newRefreshToken});  // Use renamed variable

        } catch (err) {
            console.error(err);
            return res.status(500).send({detail: "Internal Server Error"});
        }
    }

}

export default UserController;
