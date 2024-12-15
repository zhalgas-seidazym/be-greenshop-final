import {Router} from 'express';
import UserController from "../controllers/user-controller.js";
import UserRepository from "../../infrastructure/repositories/user-repository.js";
import RedisRepository from "../../infrastructure/repositories/redis-repository.js";
import {isAuth} from "../middlewares.js";

const router = Router();


const userController = new UserController(new UserRepository(), new RedisRepository());

router.post('/sign-in',
    /*
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
    (req, res) => userController.signIn(req, res)
);

router.post('/sign-up',
    /*
     #swagger.tags = ['users']
     #swagger.parameters['body'] = {
         in: 'body',
         description: 'User data.',
         required: true,
         schema: {
             firstName: "Dimash",
             lastName: "Zhalgas",
             email: "zhalgas@gmail.com",
             password: "12345678"
         }
     }
    */
    (req, res) => userController.signUp(req, res)
);

router.get("/me",
    isAuth,
    /*
     #swagger.tags = ['users']
    */
    (req, res) => userController.profile(req, res))
export default router;