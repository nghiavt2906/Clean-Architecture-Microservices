import {
  Order,
  OrderItem,
  OrderStatus,
  OrderItemProperties,
  OrderProperties,
} from "./order";

describe("OrderItem", () => {
  const validOrderItemProps: OrderItemProperties = {
    productId: "123",
    productName: "Test Product",
    quantity: 2,
    unitPrice: 10.5,
  };

  describe("constructor", () => {
    it("should create an order item with valid properties", () => {
      const orderItem = new OrderItem(validOrderItemProps);

      expect(orderItem.productId).toBe("123");
      expect(orderItem.productName).toBe("Test Product");
      expect(orderItem.quantity).toBe(2);
      expect(orderItem.unitPrice).toBe(10.5);
      expect(orderItem.subtotal).toBe(21.0);
    });

    it("should throw error for zero quantity", () => {
      const props = { ...validOrderItemProps, quantity: 0 };

      expect(() => new OrderItem(props)).toThrow(
        "Order item quantity must be greater than zero"
      );
    });

    it("should throw error for negative quantity", () => {
      const props = { ...validOrderItemProps, quantity: -1 };

      expect(() => new OrderItem(props)).toThrow(
        "Order item quantity must be greater than zero"
      );
    });

    it("should throw error for zero unit price", () => {
      const props = { ...validOrderItemProps, unitPrice: 0 };

      expect(() => new OrderItem(props)).toThrow(
        "Unit price must be greater than zero"
      );
    });

    it("should throw error for negative unit price", () => {
      const props = { ...validOrderItemProps, unitPrice: -5 };

      expect(() => new OrderItem(props)).toThrow(
        "Unit price must be greater than zero"
      );
    });
  });

  describe("subtotal", () => {
    it("should calculate subtotal correctly", () => {
      const orderItem = new OrderItem(validOrderItemProps);

      expect(orderItem.subtotal).toBe(21.0);
    });

    it("should calculate subtotal for fractional amounts", () => {
      const props = { ...validOrderItemProps, quantity: 3, unitPrice: 7.33 };
      const orderItem = new OrderItem(props);

      expect(orderItem.subtotal).toBeCloseTo(21.99);
    });
  });

  describe("toJSON", () => {
    it("should return correct JSON representation", () => {
      const orderItem = new OrderItem(validOrderItemProps);
      const json = orderItem.toJSON();

      expect(json).toEqual({
        productId: "123",
        productName: "Test Product",
        quantity: 2,
        unitPrice: 10.5,
      });
    });
  });
});

describe("Order", () => {
  const validOrderProps: OrderProperties = {
    customerId: "customer-123",
    items: [
      {
        productId: "product-1",
        productName: "Product 1",
        quantity: 2,
        unitPrice: 10.0,
      },
      {
        productId: "product-2",
        productName: "Product 2",
        quantity: 1,
        unitPrice: 15.0,
      },
    ],
  };

  describe("constructor", () => {
    it("should create an order with valid properties", () => {
      const order = new Order(validOrderProps);

      expect(order.customerId).toBe("customer-123");
      expect(order.items).toHaveLength(2);
      expect(order.status).toBe(OrderStatus.PENDING);
      expect(order.totalAmount).toBe(35.0);
      expect(order.id).toBeDefined();
      expect(order.createdAt).toBeInstanceOf(Date);
      expect(order.updatedAt).toBeInstanceOf(Date);
    });

    it("should accept custom status", () => {
      const props = {
        ...validOrderProps,
        status: OrderStatus.PAID,
      };
      const order = new Order(props);

      expect(order.status).toBe(OrderStatus.PAID);
    });

    it("should accept custom dates", () => {
      const createdAt = new Date("2023-01-01");
      const updatedAt = new Date("2023-01-02");
      const props = {
        ...validOrderProps,
        createdAt,
        updatedAt,
      };
      const order = new Order(props);

      expect(order.createdAt).toBe(createdAt);
      expect(order.updatedAt).toBe(updatedAt);
    });

    it("should throw error for empty items array", () => {
      const props = { ...validOrderProps, items: [] };

      expect(() => new Order(props)).toThrow(
        "Order must contain at least one item"
      );
    });

    it("should calculate total amount correctly", () => {
      const order = new Order(validOrderProps);

      expect(order.totalAmount).toBe(35.0);
    });
  });

  describe("updateStatus", () => {
    it("should update status successfully", () => {
      const order = new Order(validOrderProps);
      const originalUpdatedAt = order.updatedAt;

      // Wait a bit to ensure different timestamp
      setTimeout(() => {
        order.updateStatus(OrderStatus.PAID);

        expect(order.status).toBe(OrderStatus.PAID);
        expect(order.updatedAt).not.toBe(originalUpdatedAt);
      }, 1);
    });

    it("should not allow status update of cancelled order", () => {
      const props = { ...validOrderProps, status: OrderStatus.CANCELLED };
      const order = new Order(props);

      expect(() => order.updateStatus(OrderStatus.PAID)).toThrow(
        "Cannot update status of a cancelled order"
      );
    });

    it("should not allow status update of delivered order except to cancelled", () => {
      const props = { ...validOrderProps, status: OrderStatus.DELIVERED };
      const order = new Order(props);

      expect(() => order.updateStatus(OrderStatus.SHIPPED)).toThrow(
        "Cannot update status of a delivered order"
      );
    });

    it("should allow cancelling delivered order", () => {
      const props = { ...validOrderProps, status: OrderStatus.DELIVERED };
      const order = new Order(props);

      order.updateStatus(OrderStatus.CANCELLED);

      expect(order.status).toBe(OrderStatus.CANCELLED);
    });
  });

  describe("items getter", () => {
    it("should return a copy of items array", () => {
      const order = new Order(validOrderProps);
      const items = order.items;

      expect(items).toHaveLength(2);
      expect(items).not.toBe(order.items); // Should be a different array reference
    });
  });

  describe("toJSON", () => {
    it("should return correct JSON representation", () => {
      const order = new Order(validOrderProps);
      const json = order.toJSON();

      expect(json).toEqual({
        _id: order.id,
        customerId: "customer-123",
        items: [
          {
            productId: "product-1",
            productName: "Product 1",
            quantity: 2,
            unitPrice: 10.0,
          },
          {
            productId: "product-2",
            productName: "Product 2",
            quantity: 1,
            unitPrice: 15.0,
          },
        ],
        status: OrderStatus.PENDING,
        totalAmount: 35.0,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      });
    });
  });
});
