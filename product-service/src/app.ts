import { connectToMongoDB } from "./frameworks/database/mongo-connection";
import { setupExpressApp } from "./frameworks/web/express-app";
import { ProductRepositoryImpl } from "./adapters/repositories/product-repository-impl";
import { ProductController } from "./adapters/controllers/product-controller";
import {
  CreateProductUseCaseImpl,
  GetProductUseCaseImpl,
  GetAllProductsUseCaseImpl,
  GetProductsByCategoryUseCaseImpl,
  UpdateProductUseCaseImpl,
  DeleteProductUseCaseImpl,
} from "./usecases/impl/product-use-cases-impl";

export async function startApp() {
  // Get environment variables
  const MONGO_URI =
    process.env.MONGO_URI || "mongodb://localhost:27017/product-service";

  // Connect to MongoDB
  await connectToMongoDB(MONGO_URI);

  // Setup dependencies (DI)
  const productRepository = new ProductRepositoryImpl();

  const createProductUseCase = new CreateProductUseCaseImpl(productRepository);
  const getProductUseCase = new GetProductUseCaseImpl(productRepository);
  const getAllProductsUseCase = new GetAllProductsUseCaseImpl(
    productRepository
  );
  const getProductsByCategoryUseCase = new GetProductsByCategoryUseCaseImpl(
    productRepository
  );
  const updateProductUseCase = new UpdateProductUseCaseImpl(productRepository);
  const deleteProductUseCase = new DeleteProductUseCaseImpl(productRepository);

  const productController = new ProductController(
    createProductUseCase,
    getProductUseCase,
    getAllProductsUseCase,
    getProductsByCategoryUseCase,
    updateProductUseCase,
    deleteProductUseCase
  );

  // Setup Express app
  const app = setupExpressApp(productController);

  return app;
}
