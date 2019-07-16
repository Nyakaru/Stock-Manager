import express from 'express';

const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
      message: 'Handling GET requests to /orders'
    });
});

router.post('/', (req, res, next) => {
  const order = {
    productId: req.body.productId,
    quantity: req.body.quantity
  }
  res.status(201).json({
    message: 'Order created successfully',
    order: order
  });
});

router.get('/:orderId', (req, res, next) => {
  const id = req.params.productId;
  if (id == 'special') {
    res.status(200).json({
      message: 'Special id',
      id : id
    });
  } else {
      res.status(200).json({
        message: 'An id'
      });
  }
});

router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
      message: 'Deletion success'
    });
});

export default router;
