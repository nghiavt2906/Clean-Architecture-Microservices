import { Request, Response } from "express";
import { OrderController } from "./order-controller";
import { Order, OrderStatus } from "../../domain/entities/order";
import {
  CreateOrderUseCase,
  GetOrderUseCase,
  UpdateOrderStatusUseCase,
  CancelOrderUseCase,
} from "../../usecases/interfaces/order-use-cases";

// Mock use cases
const mockCreateOrderUseCase: jest.Mocked<CreateOrderUseCase> = {
  execute: jest.fn(),
};

const mockGetOrderUseCase: jest.Mocked<GetOrderUseCase> = {
  execute: jest.fn(),
};

const mockUpdateOrderStatusUseCase: jest.Mocked<UpdateOrderStatusUseCase> = {
  execute: jest.fn(),
};

const mockCancelOrderUseCase: jest.Mocked<CancelOrderUseCase> = {
  execute: jest.fn(),
};

const mockGetOrdersByCustomerUseCase = { execute: jest.fn() };
const mockGetAllOrdersUseCase = { execute: jest.fn() };

// Mock Express objects
const mockRequest = {
  body: {},
  params: {},
} as Request;

const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  send: jest.fn(),
} as unknown as Response;

describe("OrderController", () => {
  let orderController: OrderController;

  beforeEach(() => {
    jest.clearAllMocks();
    orderController = new OrderController(
      mockCreateOrderUseCase,
      mockGetOrderUseCase,
      mockGetOrdersByCustomerUseCase as any,
      mockGetAllOrdersUseCase as any,
      mockUpdateOrderStatusUseCase,
      mockCancelOrderUseCase
    );
  });

  describe("createOrder", () => {
    it("should create order successfully", async () => {
      // Arrange
      const orderData = {
        customerId: "customer-123",
        items: [
          {
            productId: "product-1",
            productName: "Product 1",
            quantity: 1,
            unitPrice: 10.0,
          },
        ],
      };
      const createdOrder = new Order(orderData);

      mockRequest.body = orderData;
      mockCreateOrderUseCase.execute.mockResolvedValue(createdOrder);

      // Act
      await orderController.createOrder(mockRequest, mockResponse);

      // Assert
      expect(mockCreateOrderUseCase.execute).toHaveBeenCalledWith(orderData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(createdOrder.toJSON());
    });

    it("should handle creation error", async () => {
      // Arrange
      const orderData = {
        customerId: "customer-123",
        items: [],
      };
      mockRequest.body = orderData;
      mockCreateOrderUseCase.execute.mockRejectedValue(
        new Error("Order must contain at least one item")
      );

      // Act
      await orderController.createOrder(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Order must contain at least one item",
      });
    });
  });

  describe("getOrder", () => {
    it("should get order successfully", async () => {
      // Arrange
      const order = new Order({
        customerId: "customer-123",
        items: [
          {
            productId: "product-1",
            productName: "Product 1",
            quantity: 1,
            unitPrice: 10.0,
          },
        ],
      });
      mockRequest.params = { id: "order-123" };
      mockGetOrderUseCase.execute.mockResolvedValue(order);

      // Act
      await orderController.getOrder(mockRequest, mockResponse);

      // Assert
      expect(mockGetOrderUseCase.execute).toHaveBeenCalledWith("order-123");
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(order.toJSON());
    });

    it("should handle order not found", async () => {
      // Arrange
      mockRequest.params = { id: "nonexistent-order" };
      mockGetOrderUseCase.execute.mockResolvedValue(null);

      // Act
      await orderController.getOrder(mockRequest, mockResponse);

      // Assert
      expect(mockGetOrderUseCase.execute).toHaveBeenCalledWith(
        "nonexistent-order"
      );
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Order not found",
      });
    });
  });

  describe("updateOrderStatus", () => {
    it("should update order status successfully", async () => {
      // Arrange
      const order = new Order({
        customerId: "customer-123",
        items: [
          {
            productId: "product-1",
            productName: "Product 1",
            quantity: 1,
            unitPrice: 10.0,
          },
        ],
      });
      mockRequest.params = { id: "order-123" };
      mockRequest.body = { status: OrderStatus.PAID };
      mockUpdateOrderStatusUseCase.execute.mockResolvedValue(order);

      // Act
      await orderController.updateOrderStatus(mockRequest, mockResponse);

      // Assert
      expect(mockUpdateOrderStatusUseCase.execute).toHaveBeenCalledWith(
        "order-123",
        OrderStatus.PAID
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(order.toJSON());
    });

    it("should handle invalid order status", async () => {
      // Arrange
      mockRequest.params = { id: "order-123" };
      mockRequest.body = { status: "INVALID_STATUS" };

      // Act
      await orderController.updateOrderStatus(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Invalid order status",
      });
    });

    it("should handle order not found", async () => {
      // Arrange
      mockRequest.params = { id: "nonexistent-order" };
      mockRequest.body = { status: OrderStatus.PAID };
      mockUpdateOrderStatusUseCase.execute.mockResolvedValue(null);

      // Act
      await orderController.updateOrderStatus(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Order not found",
      });
    });
  });

  describe("cancelOrder", () => {
    it("should cancel order successfully", async () => {
      // Arrange
      const order = new Order({
        customerId: "customer-123",
        items: [
          {
            productId: "product-1",
            productName: "Product 1",
            quantity: 1,
            unitPrice: 10.0,
          },
        ],
      });
      mockRequest.params = { id: "order-123" };
      mockCancelOrderUseCase.execute.mockResolvedValue(order);

      // Act
      await orderController.cancelOrder(mockRequest, mockResponse);

      // Assert
      expect(mockCancelOrderUseCase.execute).toHaveBeenCalledWith("order-123");
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(order.toJSON());
    });

    it("should handle order not found", async () => {
      // Arrange
      mockRequest.params = { id: "nonexistent-order" };
      mockCancelOrderUseCase.execute.mockResolvedValue(null);

      // Act
      await orderController.cancelOrder(mockRequest, mockResponse);

      // Assert
      expect(mockCancelOrderUseCase.execute).toHaveBeenCalledWith(
        "nonexistent-order"
      );
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Order not found",
      });
    });

    it("should handle cancellation error", async () => {
      // Arrange
      mockRequest.params = { id: "order-123" };
      mockCancelOrderUseCase.execute.mockRejectedValue(
        new Error("Cannot cancel a delivered order")
      );

      // Act
      await orderController.cancelOrder(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Cannot cancel a delivered order",
      });
    });
  });
});
