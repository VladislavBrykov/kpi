import { Router } from 'express';
import * as authController from '../controllers/auth';
const authRouter = Router();

authRouter.post('/sign-in', authController.login);
authRouter.get('/get-new-tokens', authController.initiateAuth);
authRouter.get('/sign-out', authController.logout);

export default authRouter;
