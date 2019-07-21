import productRoutes from './products';
import orderRoutes from './orders';
import userRoutes from './users';

const apiPrefix = '/api/v1';

const routes = [
  productRoutes,
  orderRoutes,
  userRoutes
];

export default app => {
  routes.forEach(element => {
    app.use(apiPrefix, element)
  });
  return app;
}
