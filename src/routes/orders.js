import express from 'express';
import mongoose from 'mongoose';
import checkAuth from '../middleware/check-auth';

const router = express.Router();

import Order from '../models/order';
import Product from '../models/product';

router.get('/orders', checkAuth, (req, res, next) => {
    Order.find()
      .select('product quantity _id')
      .populate('product', 'name')
      .exec()
      .then(docs => {
         res.status(200).json({
            count: docs.length,
            orders: docs
         });
      })
      .catch(err => {
         res.status(500).json({
           error: err
      });
    });
});

router.post('/orders', checkAuth, (req, res, next) => {
  Product.findById(req.body.productId)
      .then(product => {
        if (!product) {
            return res.status(404).json({
              message: 'Product not found'
            });
        }
        const order = new Order ({
          _id: mongoose.Types.ObjectId(),
          quantity: req.body.quantity,
          product: req.body.productId
      });
        return order.save();
      })
    .then(result =>{
        console.log(result);
        res.status(201).json({
          message: 'Order created',
          createdOrder: {
            quantity: result.quantity,
            product: result.product,
            _id: result._id
        }         
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
    });
  });
});

router.get('/orders/:orderId', checkAuth, (req, res, next) => {
  const id = req.params.orderId;
  Order.findById(id)
    .select('quantity product _id')
    .populate('product', 'name price')
    .exec()
    .then(doc => {
        console.log(doc);
        if (doc) {
          res.status(200).json(doc);
        } else {
          res.status(404).json({message: 'Order not found'});
        }
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.delete('/orders/:orderId', checkAuth, (req, res, next) => {
  const id = req.params.orderId;
  Order.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
          message: 'Order deleted successfully'
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err});
  });
});

export default router;
