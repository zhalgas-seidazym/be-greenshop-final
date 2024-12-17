import nodemailer from 'nodemailer';
import config from "../../main/config.js";

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: config.emailService || 'gmail', // Configurable email service
            auth: {
                user: config.rootEmail,
                pass: config.rootEmailPass
            }
        });
    }

    async sendEmail(mailOptions) {
        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
            return true;
        } catch (error) {
            console.error('Error sending email:', error);
            return false;
        }
    }

    generatePasswordResetHtml(resetLink) {
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Password Reset</h2>
                <p>You have requested to reset your password. Click the button below to proceed:</p>
                <a href="${resetLink}" style="
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #4CAF50;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                ">Reset Password</a>
                <p>If you did not request a password reset, please ignore this email.</p>
                <p>This link will expire in 15 minutes.</p>
            </div>
        `;
    }

    generateEmailVerificationHtml(verificationLink) {
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Email Verification</h2>
                <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
                <a href="${verificationLink}" style="
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #4CAF50;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                ">Verify Email</a>
                <p>If you did not request this verification, please ignore this email.</p>
                <p>This link will expire in 24 hours.</p>
            </div>
        `;
    }

    async sendPasswordResetEmail(to, resetLink) {
        const mailOptions = {
            from: config.rootEmail,
            to: to,
            subject: 'Password Reset Request',
            html: this.generatePasswordResetHtml(resetLink)
        };

        return await this.sendEmail(mailOptions);
    }

    async sendVerifyEmail(to, verificationLink) {
        const mailOptions = {
            from: config.rootEmail,
            to: to,
            subject: 'Email Verification',
            html: this.generateEmailVerificationHtml(verificationLink)
        };

        return await this.sendEmail(mailOptions);
    }

    async sendGeneralEmail(to, subject, body) {
        const mailOptions = {
            from: config.rootEmail,
            to: to,
            subject: subject,
            html: body
        };

        return await this.sendEmail(mailOptions);
    }
}

export default EmailService;
