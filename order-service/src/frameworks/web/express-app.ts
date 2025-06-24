import express, { Application } from "express";
import cors from "cors";
import { setupOrderRoutes } from "./routes/order-routes";
import { OrderController } from "../../adapters/controllers/order-controller";

export function setupExpressApp(orderController: OrderController): Application {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Routes
  const router = express.Router();
  setupOrderRoutes(router, orderController);

  app.use("/api", router);

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.status(200).send("Order Service is healthy");
  });

  return app;
}
