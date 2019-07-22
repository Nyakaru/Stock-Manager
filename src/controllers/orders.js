import mongoose from 'mongoose';

import Order from '../models/order';
import Product from '../models/product';

class OrdersControllers{
  static get_all(req, res, next) {
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
}

  static async create (req, res, next) {
    const id = req.body.productId;
    const quantity = req.body.quantity;
    await Product.findById(id)
        .then(product => {
          if (!product) {
              return res.status(404).json({
                message: 'Product not found'
              });
          }
          const order = new Order ({
            _id: mongoose.Types.ObjectId(),
            quantity: quantity,
            product: id
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
  }
  
  static async get_single (req, res, next)  {
    const id = req.params.orderId;
    Order.findById(id)
      .select('quantity product _id')
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
  }

  static delete (req, res, next) {
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
  }
}

export default OrdersControllers;
