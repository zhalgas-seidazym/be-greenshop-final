import crypto from 'crypto';
import {hashPassword} from "../../utils/bcrypt.js";


class PasswordResetController {
    constructor(userRepository, redisService, emailService) {
        this.userRepository = userRepository;
        this.redisService = redisService;
        this.emailService = emailService;
    }

    async initiatePasswordReset(req, res) {
        const {email} = req.body;
        const {redirect_url} = req.query;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({detail: "Invalid email format"});
        }

        try {
            const existingUser = await this.userRepository.findByEmail(email);
            if (!existingUser) {
                return res.status(200).json({detail: "If an account exists, reset instructions will be sent"});
            }

            const resetToken = crypto.randomBytes(32).toString('hex');

            await this.redisService.set(
                `reset_token:${resetToken}`,
                email,
                900
            );

            const resetLink = `${redirect_url}?token=${resetToken}`;

            await this.emailService.sendPasswordResetEmail(email, resetLink);

            return res.status(200).json({detail: "Password reset instructions sent"});

        } catch (error) {
            console.error(error);
            return res.status(500).json({detail: "Internal server error"});
        }
    }

    async validateResetToken(req, res) {
        const {token} = req.query;

        try {
            const email = await this.redisService.get(`reset_token:${token}`);
            if (!email) {
                return res.status(400).json({detail: "Invalid or expired reset token"});
            }

            return res.status(200).json({detail: "Token is valid", email});

        } catch (error) {
            console.error(error);
            return res.status(500).json({detail: "Internal server error"});
        }
    }

    async resetPassword(req, res) {
        const {resetToken, newPassword} = req.body;

        try {
            const email = await this.redisService.get(`reset_token:${resetToken}`);
            if (!email) {
                return res.status(400).json({detail: "Invalid or expired reset token"});
            }

            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                return res.status(404).json({detail: "User not found"});
            }

            user.password = await hashPassword(newPassword);
            await this.userRepository.update(user.id, user);
            await this.redisService.delete(`reset_token:${resetToken}`);

            return res.status(200).json({detail: "Password reset successfully"});

        } catch (error) {
            console.error(error);
            return res.status(500).json({detail: "Internal server error"});
        }
    }
}

export default PasswordResetController;