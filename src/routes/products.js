import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import checkAuth from '../middleware/check-auth';

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const imageFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg')
    cb(null, true);
   else {
  cb(null, false)
  }
};

const upload = multer({storage: storage, limits: {
  fileSize: 1024 * 1024 * 5 },
  imageFilter: imageFilter
});

import Product from '../models/product'

const router = express.Router();

router.get('/products', (req, res, next) => {
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
  });

router.post('/products', checkAuth, upload.single('productImage'), (req, res, next) => {
  console.log(req.file);
  const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
      productImage: req.file.path
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
});

router.get('/products/:productId', (req, res, next) => {
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
});

router.patch('/products/:productId', checkAuth, (req, res, next) => {
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
});

router.delete('/products/:productId', checkAuth, (req, res, next) => {
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
});

export default router;
