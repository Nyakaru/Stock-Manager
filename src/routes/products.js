import express from 'express';
import multer from 'multer';

import checkAuth from '../middleware/check-auth';
import ProductsControllers from '../controllers/products';

const router = express.Router();

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

router.get('/products', ProductsControllers.get_all);

router.post('/products', checkAuth, upload.single('productImage'), ProductsControllers.create);

router.get('/products/:productId', ProductsControllers.get_single);

router.patch('/products/:productId', checkAuth, ProductsControllers.edit);

router.delete('/products/:productId', checkAuth, ProductsControllers.delete);

export default router;
