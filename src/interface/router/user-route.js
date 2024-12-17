import {Router} from 'express';
import UserController from "../controllers/user-controller.js";
import UserRepository from "../../infrastructure/repositories/user-repository.js";
import {isAuth} from "../middlewares.js";
import PasswordController from "../controllers/password-controller.js";
import RedisService from "../../infrastructure/services/redis-service.js";
import EmailService from "../../infrastructure/services/email-service.js";
import {upload} from "../../utils/multer.js";

const router = Router();


const userRepository = new UserRepository()
const redisService = new RedisService();
const emailService = new EmailService();

const userController = new UserController(new UserRepository(), redisService, emailService);
const passwordController = new PasswordController(userRepository, redisService, emailService);

router.post('/sign-in', /*
     #swagger.tags = ['users']
     #swagger.parameters['body'] = {
         in: 'body',
         description: 'User data.',
         required: true,
         schema: {
             email: "zhalgas@gmail.com",
             password: "12345678"
         }
     }
    */
    (req, res) => userController.signIn(req, res));

router.post('/sign-up', /*
     #swagger.tags = ['users']
     #swagger.parameters['body'] = {
         in: 'body',
         description: 'User data.',
         required: true,
         schema: {
             firstName: "Dimash",
             lastName: "Zhalgas",
             email: "zhalgas@gmail.com",
             password: "12345678",
             role: "client"
         }
     }
    */
    (req, res) => userController.signUp(req, res));

router.post('/verify-email', /*
     #swagger.tags = ['users']
     #swagger.parameters['body'] = {
         in: 'body',
         description: 'User data.',
         required: true,
         schema: {
             email: "arystambekdimash005@gmail.com",
         }
     }
    */
    (req, res) => userController.sendVerificationToEmail(req, res));

router.get('/verify-email', /*
     #swagger.tags = ['users']
    */
    (req, res) => userController.validateVerifyToken(req, res));

router.get('/check-number', isAuth, /*
     #swagger.tags = ['users']
    */
    (req, res) => userController.checkPhoneNumber(req, res));


router.get("/me", isAuth,
    /*
     #swagger.tags = ['users']
    */
    (req, res) => userController.profile(req, res))

router.put('/update-profile', isAuth, /*
    #swagger.tags = ['users']
    #swagger.consumes = ['multipart/form-data']
    #swagger.parameters['firstName'] = {
        in: 'formData',
        description: 'User first name.',
        required: false,
        type: 'string',
        example: 'Dimash'
    }
    #swagger.parameters['lastName'] = {
        in: 'formData',
        description: 'User last name.',
        required: false,
        type: 'string',
        example: 'Zhalgas'
    }
    #swagger.parameters['phoneNumber'] = {
        in: 'formData',
        description: 'User phone number.',
        required: false,
        type: 'string',
        example: '+77761856565'
    }
    #swagger.parameters['email'] = {
        in: 'formData',
        description: 'User email address.',
        required: false,
        type: 'string',
        example: 'zhalgas@gmail.com'
    }
    #swagger.parameters['currentPassword'] = {
        in: 'formData',
        description: 'User current password.',
        required: false,
        type: 'string',
        example: '1234567878'
    }
    #swagger.parameters['password'] = {
        in: 'formData',
        description: 'User new password.',
        required: false,
        type: 'string',
        example: '12345678'
    }
    #swagger.parameters['profilePicture'] = {
        in: 'formData',
        description: 'User profile picture (upload).',
        required: false,
        type: 'file',
        example: 'This upload from postman'
    }
    #swagger.requestBody = {
        description: 'User data for updating profile.',
        required: false
    }
*/
    upload.single('profilePicture'), async (req, res) => {
        try {
            await userController.update_profile(req, res);
        } catch (error) {
            console.error('Unexpected Error:', error);
            res.status(500).json({detail: 'An unexpected error occurred.'});
        }
    });

router.post('/reset-password/initiate',
    /*
     #swagger.tags = ['users']
    */
    async (req, res) => passwordController.initiatePasswordReset(req, res));

router.get('/reset-password/validate-token',
    /*
     #swagger.tags = ['users']
    */
    async (req, res) => passwordController.validateResetToken(req, res));

router.post('/reset-password/reset',
    /*
     #swagger.tags = ['users']
    */
    async (req, res) => passwordController.resetPassword(req, res));

router.post('/refresh',
    /*
     #swagger.tags = ['users']
    */
    async (req, res) => userController.refreshToken(req, res));


export default router;