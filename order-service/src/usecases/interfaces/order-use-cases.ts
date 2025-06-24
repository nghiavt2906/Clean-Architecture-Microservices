import {
  Order,
  OrderProperties,
  OrderStatus,
} from "../../domain/entities/order";

export interface CreateOrderUseCase {
  execute(
    orderData: Omit<
      OrderProperties,
      "id" | "status" | "totalAmount" | "createdAt" | "updatedAt"
    >
  ): Promise<Order>;
}

export interface GetOrderUseCase {
  execute(id: string): Promise<Order | null>;
}

export interface GetOrdersByCustomerUseCase {
  execute(customerId: string): Promise<Order[]>;
}

export interface GetAllOrdersUseCase {
  execute(): Promise<Order[]>;
}

export interface UpdateOrderStatusUseCase {
  execute(id: string, status: OrderStatus): Promise<Order | null>;
}

export interface CancelOrderUseCase {
  execute(id: string): Promise<Order | null>;
}
