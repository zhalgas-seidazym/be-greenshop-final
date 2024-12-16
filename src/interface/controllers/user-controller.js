import {hashPassword, validatePassword} from "../../utils/bcrypt.js";
import {jwtEncode} from "../../utils/jwt.js";

class UserController {
    constructor(userRepository) {
        this.userRepository = userRepository;
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

            return res.status(200).send({accessToken, refreshToken});
        } catch (err) {
            console.error(err);
            return res.status(500).send({"detail": "Internal Server Error"});
        }
    }

    async signUp(req, res) {
        const {firstName, lastName, email, password, client} = req.body;
        try {
            let existingUser = await this.userRepository.findByEmail(email);
            if (existingUser) {
                return res.status(400).send({"detail": "Email already in use"});
            }

            const hashedPassword = await hashPassword(password);
            const newUser = {firstName, lastName, email, client, password: hashedPassword};

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

    async update_profile(req, res) {
        const {firstName, lastName, phoneNumber, email, currentPassword, password} = req.body;
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
                    return res.status(400).send({detail: "Password is incorrect"});
                }
                newData.password = await hashPassword(password);
            }

            const updatedUser = await this.userRepository.update(user.id, newData);

            if (!updatedUser) {
                return res.status(404).send({detail: "User not found"});
            }

            return res.status(200).send({detail: "Profile updated", user: updatedUser});
        } catch (err) {
            console.error(err);

            if (err.name === "ValidationError") {
                return res.status(400).send({detail: "Invalid data", errors: err.errors});
            }

            return res.status(500).send({detail: "Internal Server Error"});
        }
    }
}

export default UserController;
