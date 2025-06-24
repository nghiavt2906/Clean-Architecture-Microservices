import express, { Application } from "express";
import cors from "cors";
import { setupProductRoutes } from "./routes/product-routes";
import { ProductController } from "../../adapters/controllers/product-controller";

export function setupExpressApp(
  productController: ProductController
): Application {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Routes
  const router = express.Router();
  setupProductRoutes(router, productController);

  app.use("/api", router);

  // Health check endpoint
  app.get("/health", (req: express.Request, res: express.Response) => {
    res.status(200).send("Product Service is healthy");
  });

  return app;
}
