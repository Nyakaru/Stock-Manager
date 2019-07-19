import productRoutes from './products';
import orderRoutes from './orders';

const apiPrefix = '/api/v1';

const routes = [
  productRoutes,
  orderRoutes
];

export default app => {
  routes.forEach(element => {
    app.use(apiPrefix, element)
  });
  return app;
}
