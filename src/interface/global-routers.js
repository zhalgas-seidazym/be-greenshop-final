import {Router} from 'express';
import userRouter from './router/user.js';

const router = Router();

router.use("/users", userRouter)

export default router;