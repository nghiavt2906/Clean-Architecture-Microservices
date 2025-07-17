import { Product, ProductProperties } from "./product";

describe("Product", () => {
  const validProductProps: ProductProperties = {
    name: "Test Product",
    description: "A test product",
    price: 29.99,
    category: "Electronics",
    inStock: 100,
  };

  describe("constructor", () => {
    it("should create a product with valid properties", () => {
      const product = new Product(validProductProps);

      expect(product.name).toBe("Test Product");
      expect(product.description).toBe("A test product");
      expect(product.price).toBe(29.99);
      expect(product.category).toBe("Electronics");
      expect(product.inStock).toBe(100);
      expect(product.id).toBeDefined();
      expect(product.createdAt).toBeInstanceOf(Date);
      expect(product.updatedAt).toBeInstanceOf(Date);
    });

    it("should accept custom dates", () => {
      const createdAt = new Date("2023-01-01");
      const updatedAt = new Date("2023-01-02");
      const props = {
        ...validProductProps,
        createdAt,
        updatedAt,
      };
      const product = new Product(props);

      expect(product.createdAt).toBe(createdAt);
      expect(product.updatedAt).toBe(updatedAt);
    });

    it("should throw error for empty product name", () => {
      const props = { ...validProductProps, name: "" };

      expect(() => new Product(props)).toThrow("Product name cannot be empty");
    });

    it("should throw error for whitespace-only product name", () => {
      const props = { ...validProductProps, name: "   " };

      expect(() => new Product(props)).toThrow("Product name cannot be empty");
    });

    it("should throw error for zero price", () => {
      const props = { ...validProductProps, price: 0 };

      expect(() => new Product(props)).toThrow(
        "Product price must be greater than zero"
      );
    });

    it("should throw error for negative price", () => {
      const props = { ...validProductProps, price: -10 };

      expect(() => new Product(props)).toThrow(
        "Product price must be greater than zero"
      );
    });

    it("should throw error for negative stock", () => {
      const props = { ...validProductProps, inStock: -5 };

      expect(() => new Product(props)).toThrow(
        "Stock quantity cannot be negative"
      );
    });

    it("should allow zero stock", () => {
      const props = { ...validProductProps, inStock: 0 };

      expect(() => new Product(props)).not.toThrow();
      const product = new Product(props);
      expect(product.inStock).toBe(0);
    });
  });

  describe("updateStock", () => {
    it("should increase stock successfully", () => {
      const product = new Product(validProductProps);
      const originalUpdatedAt = product.updatedAt;

      product.updateStock(10);

      expect(product.inStock).toBe(110);
      expect(product.updatedAt).not.toBe(originalUpdatedAt);
    });

    it("should decrease stock successfully", () => {
      const product = new Product(validProductProps);

      product.updateStock(-20);

      expect(product.inStock).toBe(80);
    });

    it("should throw error when stock would go negative", () => {
      const product = new Product(validProductProps);

      expect(() => product.updateStock(-150)).toThrow(
        "Cannot reduce stock below zero"
      );
    });

    it("should allow stock to go to zero", () => {
      const product = new Product(validProductProps);

      product.updateStock(-100);

      expect(product.inStock).toBe(0);
    });
  });

  describe("updateDetails", () => {
    it("should update name successfully", () => {
      const product = new Product(validProductProps);
      const originalUpdatedAt = product.updatedAt;

      product.updateDetails("New Name");

      expect(product.name).toBe("New Name");
      expect(product.updatedAt).not.toBe(originalUpdatedAt);
    });

    it("should update description successfully", () => {
      const product = new Product(validProductProps);

      product.updateDetails(undefined, "New Description");

      expect(product.description).toBe("New Description");
    });

    it("should update price successfully", () => {
      const product = new Product(validProductProps);

      product.updateDetails(undefined, undefined, 39.99);

      expect(product.price).toBe(39.99);
    });

    it("should update category successfully", () => {
      const product = new Product(validProductProps);

      product.updateDetails(undefined, undefined, undefined, "Books");

      expect(product.category).toBe("Books");
    });

    it("should update multiple properties at once", () => {
      const product = new Product(validProductProps);

      product.updateDetails("New Name", "New Description", 49.99, "Books");

      expect(product.name).toBe("New Name");
      expect(product.description).toBe("New Description");
      expect(product.price).toBe(49.99);
      expect(product.category).toBe("Books");
    });

    it("should throw error for invalid name after update", () => {
      const product = new Product(validProductProps);

      expect(() => product.updateDetails("")).toThrow(
        "Product name cannot be empty"
      );
    });

    it("should throw error for invalid price after update", () => {
      const product = new Product(validProductProps);

      expect(() => product.updateDetails(undefined, undefined, 0)).toThrow(
        "Product price must be greater than zero"
      );
    });
  });

  describe("toJSON", () => {
    it("should return plain object with all properties", () => {
      const product = new Product(validProductProps);
      const json = product.toJSON();

      expect(json).toEqual({
        _id: product.id,
        name: "Test Product",
        description: "A test product",
        price: 29.99,
        category: "Electronics",
        inStock: 100,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      });
    });
  });
});
