import {
  CreateProductUseCaseImpl,
  GetProductUseCaseImpl,
  GetAllProductsUseCaseImpl,
  GetProductsByCategoryUseCaseImpl,
  UpdateProductUseCaseImpl,
  DeleteProductUseCaseImpl,
} from "./product-use-cases-impl";
import { ProductRepository } from "../../domain/interfaces/product-repository";
import { Product } from "../../domain/entities/product";

describe("Product Use Cases", () => {
  let mockProductRepository: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    mockProductRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByCategory: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
  });

  describe("CreateProductUseCaseImpl", () => {
    let createProductUseCase: CreateProductUseCaseImpl;

    beforeEach(() => {
      createProductUseCase = new CreateProductUseCaseImpl(
        mockProductRepository
      );
    });

    it("should create a product successfully", async () => {
      const productData = {
        name: "Test Product",
        description: "A test product",
        price: 29.99,
        category: "Electronics",
        inStock: 100,
      };

      const expectedProduct = new Product(productData);
      mockProductRepository.save.mockResolvedValue(expectedProduct);

      const result = await createProductUseCase.execute(productData);

      expect(mockProductRepository.save).toHaveBeenCalledWith(
        expect.any(Product)
      );
      expect(result).toBe(expectedProduct);
    });

    it("should throw error for invalid product data", async () => {
      const productData = {
        name: "",
        description: "A test product",
        price: 29.99,
        category: "Electronics",
        inStock: 100,
      };

      await expect(createProductUseCase.execute(productData)).rejects.toThrow(
        "Product name cannot be empty"
      );
    });
  });

  describe("GetProductUseCaseImpl", () => {
    let getProductUseCase: GetProductUseCaseImpl;

    beforeEach(() => {
      getProductUseCase = new GetProductUseCaseImpl(mockProductRepository);
    });

    it("should return product when found", async () => {
      const productId = "test-id";
      const expectedProduct = new Product({
        name: "Test Product",
        description: "A test product",
        price: 29.99,
        category: "Electronics",
        inStock: 100,
      });

      mockProductRepository.findById.mockResolvedValue(expectedProduct);

      const result = await getProductUseCase.execute(productId);

      expect(mockProductRepository.findById).toHaveBeenCalledWith(productId);
      expect(result).toBe(expectedProduct);
    });

    it("should return null when product not found", async () => {
      const productId = "non-existent-id";
      mockProductRepository.findById.mockResolvedValue(null);

      const result = await getProductUseCase.execute(productId);

      expect(mockProductRepository.findById).toHaveBeenCalledWith(productId);
      expect(result).toBeNull();
    });
  });

  describe("GetAllProductsUseCaseImpl", () => {
    let getAllProductsUseCase: GetAllProductsUseCaseImpl;

    beforeEach(() => {
      getAllProductsUseCase = new GetAllProductsUseCaseImpl(
        mockProductRepository
      );
    });

    it("should return all products", async () => {
      const expectedProducts = [
        new Product({
          name: "Product 1",
          description: "First product",
          price: 19.99,
          category: "Electronics",
          inStock: 50,
        }),
        new Product({
          name: "Product 2",
          description: "Second product",
          price: 39.99,
          category: "Books",
          inStock: 30,
        }),
      ];

      mockProductRepository.findAll.mockResolvedValue(expectedProducts);

      const result = await getAllProductsUseCase.execute();

      expect(mockProductRepository.findAll).toHaveBeenCalled();
      expect(result).toBe(expectedProducts);
    });

    it("should return empty array when no products found", async () => {
      mockProductRepository.findAll.mockResolvedValue([]);

      const result = await getAllProductsUseCase.execute();

      expect(mockProductRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe("GetProductsByCategoryUseCaseImpl", () => {
    let getProductsByCategoryUseCase: GetProductsByCategoryUseCaseImpl;

    beforeEach(() => {
      getProductsByCategoryUseCase = new GetProductsByCategoryUseCaseImpl(
        mockProductRepository
      );
    });

    it("should return products by category", async () => {
      const category = "Electronics";
      const expectedProducts = [
        new Product({
          name: "Product 1",
          description: "First product",
          price: 19.99,
          category: "Electronics",
          inStock: 50,
        }),
      ];

      mockProductRepository.findByCategory.mockResolvedValue(expectedProducts);

      const result = await getProductsByCategoryUseCase.execute(category);

      expect(mockProductRepository.findByCategory).toHaveBeenCalledWith(
        category
      );
      expect(result).toBe(expectedProducts);
    });
  });

  describe("UpdateProductUseCaseImpl", () => {
    let updateProductUseCase: UpdateProductUseCaseImpl;

    beforeEach(() => {
      updateProductUseCase = new UpdateProductUseCaseImpl(
        mockProductRepository
      );
    });

    it("should update product successfully", async () => {
      const productId = "test-id";
      const existingProduct = new Product({
        name: "Old Name",
        description: "Old description",
        price: 19.99,
        category: "Electronics",
        inStock: 50,
      });

      const updateData = {
        name: "New Name",
        price: 29.99,
      };

      mockProductRepository.findById.mockResolvedValue(existingProduct);
      mockProductRepository.update.mockResolvedValue(existingProduct);

      const result = await updateProductUseCase.execute(productId, updateData);

      expect(mockProductRepository.findById).toHaveBeenCalledWith(productId);
      expect(mockProductRepository.update).toHaveBeenCalledWith(
        existingProduct
      );
      expect(result).toBe(existingProduct);
    });

    it("should update stock correctly", async () => {
      const productId = "test-id";
      const existingProduct = new Product({
        name: "Test Product",
        description: "Test description",
        price: 19.99,
        category: "Electronics",
        inStock: 50,
      });

      const updateData = {
        inStock: 75,
      };

      mockProductRepository.findById.mockResolvedValue(existingProduct);
      mockProductRepository.update.mockResolvedValue(existingProduct);

      const result = await updateProductUseCase.execute(productId, updateData);

      expect(result?.inStock).toBe(75);
    });

    it("should return null when product not found", async () => {
      const productId = "non-existent-id";
      mockProductRepository.findById.mockResolvedValue(null);

      const result = await updateProductUseCase.execute(productId, {
        name: "New Name",
      });

      expect(mockProductRepository.findById).toHaveBeenCalledWith(productId);
      expect(mockProductRepository.update).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe("DeleteProductUseCaseImpl", () => {
    let deleteProductUseCase: DeleteProductUseCaseImpl;

    beforeEach(() => {
      deleteProductUseCase = new DeleteProductUseCaseImpl(
        mockProductRepository
      );
    });

    it("should delete product successfully", async () => {
      const productId = "test-id";
      mockProductRepository.delete.mockResolvedValue(true);

      const result = await deleteProductUseCase.execute(productId);

      expect(mockProductRepository.delete).toHaveBeenCalledWith(productId);
      expect(result).toBe(true);
    });

    it("should return false when product not found", async () => {
      const productId = "non-existent-id";
      mockProductRepository.delete.mockResolvedValue(false);

      const result = await deleteProductUseCase.execute(productId);

      expect(mockProductRepository.delete).toHaveBeenCalledWith(productId);
      expect(result).toBe(false);
    });
  });
});
