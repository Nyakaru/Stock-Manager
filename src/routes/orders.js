import express from 'express';

import checkAuth from '../middleware/check-auth';

const router = express.Router();

import OrdersControllers from '../controllers/orders';

router.get('/orders', checkAuth, OrdersControllers.get_all);

router.post('/orders', checkAuth, OrdersControllers.create);

router.get('/orders/:orderId', checkAuth, OrdersControllers.get_single);

router.delete('/orders/:orderId', checkAuth, OrdersControllers.delete);

export default router;
