import {
  Order,
  OrderProperties,
  OrderStatus,
} from "../../domain/entities/order";
import { OrderRepository } from "../../domain/interfaces/order-repository";
import { ProductService } from "../../domain/interfaces/product-service";
import {
  CreateOrderUseCase,
  GetOrderUseCase,
  GetOrdersByCustomerUseCase,
  GetAllOrdersUseCase,
  UpdateOrderStatusUseCase,
  CancelOrderUseCase,
} from "../interfaces/order-use-cases";

export class CreateOrderUseCaseImpl implements CreateOrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly productService: ProductService
  ) {}

  async execute(
    orderData: Omit<
      OrderProperties,
      "id" | "status" | "totalAmount" | "createdAt" | "updatedAt"
    >
  ): Promise<Order> {
    // Validate product availability
    for (const item of orderData.items) {
      const product = await this.productService.checkProductAvailability(
        item.productId
      );

      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      if (product.inStock < item.quantity) {
        throw new Error(`Insufficient stock for product ${product.name}`);
      }
    }

    // Create order
    const order = new Order(orderData);

    // Update product stock
    for (const item of order.items) {
      await this.productService.updateProductStock(
        item.productId,
        -item.quantity
      );
    }

    // Save order
    return this.orderRepository.save(order);
  }
}

export class GetOrderUseCaseImpl implements GetOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(id: string): Promise<Order | null> {
    return this.orderRepository.findById(id);
  }
}

export class GetOrdersByCustomerUseCaseImpl
  implements GetOrdersByCustomerUseCase
{
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(customerId: string): Promise<Order[]> {
    return this.orderRepository.findByCustomerId(customerId);
  }
}

export class GetAllOrdersUseCaseImpl implements GetAllOrdersUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }
}

export class UpdateOrderStatusUseCaseImpl implements UpdateOrderStatusUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(id: string, status: OrderStatus): Promise<Order | null> {
    const order = await this.orderRepository.findById(id);

    if (status === OrderStatus.CANCELLED) {
      throw new Error("Cannot update order status to CANCELLED directly");
    }

    if (!order) {
      return null;
    }

    order.updateStatus(status);
    return this.orderRepository.update(order);
  }
}

export class CancelOrderUseCaseImpl implements CancelOrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly productService: ProductService
  ) {}

  async execute(id: string): Promise<Order | null> {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      return null;
    }

    if (order.status === OrderStatus.DELIVERED) {
      throw new Error("Cannot cancel a delivered order");
    }

    if (order.status !== OrderStatus.CANCELLED) {
      // Restore product stock
      for (const item of order.items) {
        await this.productService.updateProductStock(
          item.productId,
          item.quantity
        );
      }

      order.updateStatus(OrderStatus.CANCELLED);
      return this.orderRepository.update(order);
    }

    return order;
  }
}
