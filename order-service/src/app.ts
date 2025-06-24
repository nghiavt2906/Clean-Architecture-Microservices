import { connectToMongoDB } from "./frameworks/database/mongo-connection";
import { setupExpressApp } from "./frameworks/web/express-app";
import { OrderRepositoryImpl } from "./adapters/repositories/order-repository-impl";
import { ProductServiceImpl } from "./adapters/services/product-service-impl";
import { OrderController } from "./adapters/controllers/order-controller";
import {
  CreateOrderUseCaseImpl,
  GetOrderUseCaseImpl,
  GetOrdersByCustomerUseCaseImpl,
  GetAllOrdersUseCaseImpl,
  UpdateOrderStatusUseCaseImpl,
  CancelOrderUseCaseImpl,
} from "./usecases/impl/order-use-cases-impl";

export async function startApp() {
  // Get environment variables
  const MONGO_URI =
    process.env.MONGO_URI || "mongodb://localhost:27017/order-service";
  const PRODUCT_SERVICE_URL =
    process.env.PRODUCT_SERVICE_URL || "http://localhost:3001";

  // Connect to MongoDB
  await connectToMongoDB(MONGO_URI);

  // Setup dependencies (DI)
  const orderRepository = new OrderRepositoryImpl();
  const productService = new ProductServiceImpl(PRODUCT_SERVICE_URL);

  const createOrderUseCase = new CreateOrderUseCaseImpl(
    orderRepository,
    productService
  );
  const getOrderUseCase = new GetOrderUseCaseImpl(orderRepository);
  const getOrdersByCustomerUseCase = new GetOrdersByCustomerUseCaseImpl(
    orderRepository
  );
  const getAllOrdersUseCase = new GetAllOrdersUseCaseImpl(orderRepository);
  const updateOrderStatusUseCase = new UpdateOrderStatusUseCaseImpl(
    orderRepository
  );
  const cancelOrderUseCase = new CancelOrderUseCaseImpl(
    orderRepository,
    productService
  );

  const orderController = new OrderController(
    createOrderUseCase,
    getOrderUseCase,
    getOrdersByCustomerUseCase,
    getAllOrdersUseCase,
    updateOrderStatusUseCase,
    cancelOrderUseCase
  );

  // Setup Express app
  const app = setupExpressApp(orderController);

  return app;
}
