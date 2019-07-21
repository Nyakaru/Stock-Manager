import mongoose from 'mongoose';

import Product from '../models/product';

class ProductsControllers {
  static get_all (req, res, next) {
    Product.find()
      .select('name price _id productImage')
      .exec()
      .then(docs => {
          const responseBody = {
              count: docs.length,
              products: docs
          };
          res.status(200).json(responseBody);
      })
      .catch(err => {
          console.log(err);
          res.status(500).json({error: err});
      });
  }

  static create  (req, res, next) {
    const name = req.body.name;
    const price = req.body.price;
    const productImage = req.file.path;
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: name,
        price: price,
        productImage: productImage
    });
    product.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
          message: 'Product created successfully',
          createdProduct: {
              name: result.name,
              price: result.price,
              _id: result._id,
              productImage: result.productImage
          }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err});
  });
  }

  static get_single (req, res, next) {
    const id = req.params.productId;
    Product.findById(id)
      .select('name price _id productImage')
      .exec()
      .then(doc => {
          console.log(doc);
          if (doc) {
            res.status(200).json(doc);
          } else {
            res.status(404).json({message: 'Product not found'});
          }
          
      })
      .catch(err => {
          console.log(err);
          res.status(500).json({error: err});
      });
  }

  static edit (req, res, next) {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] =ops.value;
    }
    Product.updateOne({_id: id}, {$set: updateOps})
      .exec()
      .then(result => {
          res.status(200).json({
            message: 'Product updated successfully'
          });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
  }

  static delete (req, res, next) {
    const id = req.params.productId;
    Product.remove({_id: id})
      .exec()
      .then(result => {
          res.status(200).json({
            message: 'Product deleted successfully'
          });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}
}

export default ProductsControllers;
