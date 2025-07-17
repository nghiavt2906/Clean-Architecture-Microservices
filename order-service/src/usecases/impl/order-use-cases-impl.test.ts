import {
  CreateOrderUseCaseImpl,
  GetOrderUseCaseImpl,
  UpdateOrderStatusUseCaseImpl,
  CancelOrderUseCaseImpl,
} from "./order-use-cases-impl";
import { OrderRepository } from "../../domain/interfaces/order-repository";
import { ProductService } from "../../domain/interfaces/product-service";
import { Order, OrderStatus } from "../../domain/entities/order";

// Mock implementations
const mockOrderRepository: jest.Mocked<OrderRepository> = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByCustomerId: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockProductService: jest.Mocked<ProductService> = {
  checkProductAvailability: jest.fn(),
  updateProductStock: jest.fn(),
};

describe("CreateOrderUseCaseImpl", () => {
  let createOrderUseCase: CreateOrderUseCaseImpl;

  beforeEach(() => {
    jest.clearAllMocks();
    createOrderUseCase = new CreateOrderUseCaseImpl(
      mockOrderRepository,
      mockProductService
    );
  });

  const validOrderData = {
    customerId: "customer-123",
    items: [
      {
        productId: "product-1",
        productName: "Product 1",
        quantity: 2,
        unitPrice: 10.0,
      },
    ],
  };

  it("should create order successfully", async () => {
    // Arrange
    mockProductService.checkProductAvailability.mockResolvedValue({
      id: "product-1",
      name: "Product 1",
      inStock: 10,
      price: 10.0,
    });
    mockProductService.updateProductStock.mockResolvedValue(true);

    const expectedOrder = new Order(validOrderData);
    mockOrderRepository.save.mockResolvedValue(expectedOrder);

    // Act
    const result = await createOrderUseCase.execute(validOrderData);

    // Assert
    expect(mockProductService.checkProductAvailability).toHaveBeenCalledWith(
      "product-1"
    );
    expect(mockProductService.updateProductStock).toHaveBeenCalledWith(
      "product-1",
      -2
    );
    expect(mockOrderRepository.save).toHaveBeenCalled();
    expect(result).toEqual(expectedOrder);
  });

  it("should throw error when product not found", async () => {
    // Arrange
    mockProductService.checkProductAvailability.mockResolvedValue(null);

    // Act & Assert
    await expect(createOrderUseCase.execute(validOrderData)).rejects.toThrow(
      "Product product-1 not found"
    );
  });

  it("should throw error when insufficient stock", async () => {
    // Arrange
    mockProductService.checkProductAvailability.mockResolvedValue({
      id: "product-1",
      name: "Product 1",
      inStock: 1,
      price: 10.0,
    });

    // Act & Assert
    await expect(createOrderUseCase.execute(validOrderData)).rejects.toThrow(
      "Insufficient stock for product Product 1"
    );
  });
});

describe("GetOrderUseCaseImpl", () => {
  let getOrderUseCase: GetOrderUseCaseImpl;

  beforeEach(() => {
    jest.clearAllMocks();
    getOrderUseCase = new GetOrderUseCaseImpl(mockOrderRepository);
  });

  it("should return order when found", async () => {
    // Arrange
    const expectedOrder = new Order({
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
    mockOrderRepository.findById.mockResolvedValue(expectedOrder);

    // Act
    const result = await getOrderUseCase.execute("order-123");

    // Assert
    expect(mockOrderRepository.findById).toHaveBeenCalledWith("order-123");
    expect(result).toEqual(expectedOrder);
  });

  it("should return null when order not found", async () => {
    // Arrange
    mockOrderRepository.findById.mockResolvedValue(null);

    // Act
    const result = await getOrderUseCase.execute("nonexistent-order");

    // Assert
    expect(mockOrderRepository.findById).toHaveBeenCalledWith(
      "nonexistent-order"
    );
    expect(result).toBeNull();
  });
});

describe("UpdateOrderStatusUseCaseImpl", () => {
  let updateOrderStatusUseCase: UpdateOrderStatusUseCaseImpl;

  beforeEach(() => {
    jest.clearAllMocks();
    updateOrderStatusUseCase = new UpdateOrderStatusUseCaseImpl(
      mockOrderRepository
    );
  });

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
    mockOrderRepository.findById.mockResolvedValue(order);
    mockOrderRepository.update.mockResolvedValue(order);

    // Act
    const result = await updateOrderStatusUseCase.execute(
      "order-123",
      OrderStatus.PAID
    );

    // Assert
    expect(mockOrderRepository.findById).toHaveBeenCalledWith("order-123");
    expect(order.status).toBe(OrderStatus.PAID);
    expect(mockOrderRepository.update).toHaveBeenCalledWith(order);
    expect(result).toEqual(order);
  });

  it("should return null when order not found", async () => {
    // Arrange
    mockOrderRepository.findById.mockResolvedValue(null);

    // Act
    const result = await updateOrderStatusUseCase.execute(
      "nonexistent-order",
      OrderStatus.PAID
    );

    // Assert
    expect(mockOrderRepository.findById).toHaveBeenCalledWith(
      "nonexistent-order"
    );
    expect(result).toBeNull();
  });
});

describe("CancelOrderUseCaseImpl", () => {
  let cancelOrderUseCase: CancelOrderUseCaseImpl;

  beforeEach(() => {
    jest.clearAllMocks();
    cancelOrderUseCase = new CancelOrderUseCaseImpl(
      mockOrderRepository,
      mockProductService
    );
  });

  it("should cancel order and restore stock", async () => {
    // Arrange
    const order = new Order({
      customerId: "customer-123",
      items: [
        {
          productId: "product-1",
          productName: "Product 1",
          quantity: 2,
          unitPrice: 10.0,
        },
      ],
    });
    mockOrderRepository.findById.mockResolvedValue(order);
    mockProductService.updateProductStock.mockResolvedValue(true);
    mockOrderRepository.update.mockResolvedValue(order);

    // Act
    const result = await cancelOrderUseCase.execute("order-123");

    // Assert
    expect(mockOrderRepository.findById).toHaveBeenCalledWith("order-123");
    expect(mockProductService.updateProductStock).toHaveBeenCalledWith(
      "product-1",
      2
    );
    expect(order.status).toBe(OrderStatus.CANCELLED);
    expect(mockOrderRepository.update).toHaveBeenCalledWith(order);
    expect(result).toEqual(order);
  });

  it("should throw error when trying to cancel delivered order", async () => {
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
      status: OrderStatus.DELIVERED,
    });
    mockOrderRepository.findById.mockResolvedValue(order);

    // Act & Assert
    await expect(cancelOrderUseCase.execute("order-123")).rejects.toThrow(
      "Cannot cancel a delivered order"
    );
  });

  it("should return order if already cancelled", async () => {
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
      status: OrderStatus.CANCELLED,
    });
    mockOrderRepository.findById.mockResolvedValue(order);

    // Act
    const result = await cancelOrderUseCase.execute("order-123");

    // Assert
    expect(mockOrderRepository.findById).toHaveBeenCalledWith("order-123");
    expect(mockProductService.updateProductStock).not.toHaveBeenCalled();
    expect(mockOrderRepository.update).not.toHaveBeenCalled();
    expect(result).toEqual(order);
  });

  it("should return null when order not found", async () => {
    // Arrange
    mockOrderRepository.findById.mockResolvedValue(null);

    // Act
    const result = await cancelOrderUseCase.execute("nonexistent-order");

    // Assert
    expect(mockOrderRepository.findById).toHaveBeenCalledWith(
      "nonexistent-order"
    );
    expect(result).toBeNull();
  });
});
