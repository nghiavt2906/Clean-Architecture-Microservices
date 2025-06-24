import { Request, Response } from "express";
import { OrderStatus } from "../../domain/entities/order";
import {
  CreateOrderUseCase,
  GetOrderUseCase,
  GetOrdersByCustomerUseCase,
  GetAllOrdersUseCase,
  UpdateOrderStatusUseCase,
  CancelOrderUseCase,
} from "../../usecases/interfaces/order-use-cases";

export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly getOrderUseCase: GetOrderUseCase,
    private readonly getOrdersByCustomerUseCase: GetOrdersByCustomerUseCase,
    private readonly getAllOrdersUseCase: GetAllOrdersUseCase,
    private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
    private readonly cancelOrderUseCase: CancelOrderUseCase
  ) {}

  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const orderData = req.body;
      const order = await this.createOrderUseCase.execute(orderData);
      res.status(201).json(order.toJSON());
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const order = await this.getOrderUseCase.execute(id);

      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }

      res.status(200).json(order.toJSON());
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getOrdersByCustomer(req: Request, res: Response): Promise<void> {
    try {
      const { customerId } = req.params;
      const orders = await this.getOrdersByCustomerUseCase.execute(customerId);
      res.status(200).json(orders.map((order) => order.toJSON()));
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getAllOrders(req: Request, res: Response): Promise<void> {
    try {
      const orders = await this.getAllOrdersUseCase.execute();
      res.status(200).json(orders.map((order) => order.toJSON()));
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async updateOrderStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!Object.values(OrderStatus).includes(status)) {
        res.status(400).json({ error: "Invalid order status" });
        return;
      }

      const order = await this.updateOrderStatusUseCase.execute(id, status);

      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }

      res.status(200).json(order.toJSON());
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async cancelOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const order = await this.cancelOrderUseCase.execute(id);

      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }

      res.status(200).json(order.toJSON());
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}
