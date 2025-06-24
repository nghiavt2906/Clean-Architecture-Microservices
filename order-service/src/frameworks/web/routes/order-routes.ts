import { Router } from "express";
import { OrderController } from "../../../adapters/controllers/order-controller";

export function setupOrderRoutes(
  router: Router,
  orderController: OrderController
): Router {
  // Bind methods to ensure correct 'this' context
  const createOrder = orderController.createOrder.bind(orderController);
  const getOrder = orderController.getOrder.bind(orderController);
  const getOrdersByCustomer =
    orderController.getOrdersByCustomer.bind(orderController);
  const getAllOrders = orderController.getAllOrders.bind(orderController);
  const updateOrderStatus =
    orderController.updateOrderStatus.bind(orderController);
  const cancelOrder = orderController.cancelOrder.bind(orderController);

  router.post("/orders", createOrder);
  router.get("/orders", getAllOrders);
  router.get("/orders/:id", getOrder);
  router.get("/orders/customer/:customerId", getOrdersByCustomer);
  router.patch("/orders/:id/status", updateOrderStatus);
  router.patch("/orders/:id/cancel", cancelOrder);

  return router;
}
