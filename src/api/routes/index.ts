import { Router } from 'express';
import reportsRouter from './reports';
import communityRouter from './community';
import keywordRouter from './keyword';
import authRouter from './auth';
import { authenticationByToken } from '../middlewares/authentification';

const router = Router();

router.use('/reports', authenticationByToken, reportsRouter);
router.use('/community', authenticationByToken, communityRouter);
router.use('/keyword', authenticationByToken, keywordRouter);
router.use('/auth', authRouter);

export default router;
