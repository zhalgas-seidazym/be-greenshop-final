import nodemailer from 'nodemailer';
import config from "../../main/config.js";

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.rootEmail,
                pass: config.rootEmailPass
            }
        });
    }

    async sendPasswordResetEmail(to, resetLink) {
        const mailOptions = {
            from: config.rootEmail,
            to: to,
            subject: 'Password Reset Request',
            html: `
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
            `
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
            return true;
        } catch (error) {
            console.error('Error sending email:', error);
            return false;
        }
    }

    async sendGeneralEmail(to, subject, body) {
        const mailOptions = {
            from: config.rootEmail,
            to: to,
            subject: subject,
            html: body
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
            return true;
        } catch (error) {
            console.error('Error sending email:', error);
            return false;
        }
    }
}

export default EmailService;