import express from 'express';

import UsersControllers from '../controllers/users';
import checkAuth from '../middleware/check-auth';

const router = express.Router();

router.post('/users/signup', UsersControllers.signup);

router.delete('/users/:userId', checkAuth, UsersControllers.delete);

router.post('/users/login', UsersControllers.login);

export default router;
