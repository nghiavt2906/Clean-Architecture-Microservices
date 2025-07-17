import { Request, Response } from "express";
import { ProductController } from "./product-controller";
import {
  CreateProductUseCase,
  GetProductUseCase,
  GetAllProductsUseCase,
  GetProductsByCategoryUseCase,
  UpdateProductUseCase,
  DeleteProductUseCase,
} from "../../usecases/interfaces/product-use-cases";
import { Product } from "../../domain/entities/product";

describe("ProductController", () => {
  let productController: ProductController;
  let mockCreateProductUseCase: jest.Mocked<CreateProductUseCase>;
  let mockGetProductUseCase: jest.Mocked<GetProductUseCase>;
  let mockGetAllProductsUseCase: jest.Mocked<GetAllProductsUseCase>;
  let mockGetProductsByCategoryUseCase: jest.Mocked<GetProductsByCategoryUseCase>;
  let mockUpdateProductUseCase: jest.Mocked<UpdateProductUseCase>;
  let mockDeleteProductUseCase: jest.Mocked<DeleteProductUseCase>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockCreateProductUseCase = {
      execute: jest.fn(),
    };
    mockGetProductUseCase = {
      execute: jest.fn(),
    };
    mockGetAllProductsUseCase = {
      execute: jest.fn(),
    };
    mockGetProductsByCategoryUseCase = {
      execute: jest.fn(),
    };
    mockUpdateProductUseCase = {
      execute: jest.fn(),
    };
    mockDeleteProductUseCase = {
      execute: jest.fn(),
    };

    productController = new ProductController(
      mockCreateProductUseCase,
      mockGetProductUseCase,
      mockGetAllProductsUseCase,
      mockGetProductsByCategoryUseCase,
      mockUpdateProductUseCase,
      mockDeleteProductUseCase
    );

    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnThis(),
    };
  });

  describe("createProduct", () => {
    it("should create product and return 201 status", async () => {
      const productData = {
        name: "Test Product",
        description: "A test product",
        price: 29.99,
        category: "Electronics",
        inStock: 100,
      };

      const createdProduct = new Product(productData);
      mockCreateProductUseCase.execute.mockResolvedValue(createdProduct);
      mockRequest.body = productData;

      await productController.createProduct(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockCreateProductUseCase.execute).toHaveBeenCalledWith(
        productData
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(createdProduct.toJSON());
    });

    it("should return 400 status when validation fails", async () => {
      const productData = {
        name: "",
        description: "A test product",
        price: 29.99,
        category: "Electronics",
        inStock: 100,
      };

      mockCreateProductUseCase.execute.mockRejectedValue(
        new Error("Product name cannot be empty")
      );
      mockRequest.body = productData;

      await productController.createProduct(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Product name cannot be empty",
      });
    });
  });

  describe("getProduct", () => {
    it("should return product when found", async () => {
      const productId = "test-id";
      const product = new Product({
        name: "Test Product",
        description: "A test product",
        price: 29.99,
        category: "Electronics",
        inStock: 100,
      });

      mockGetProductUseCase.execute.mockResolvedValue(product);
      mockRequest.params = { id: productId };

      await productController.getProduct(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockGetProductUseCase.execute).toHaveBeenCalledWith(productId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(product.toJSON());
    });

    it("should return 404 when product not found", async () => {
      const productId = "non-existent-id";
      mockGetProductUseCase.execute.mockResolvedValue(null);
      mockRequest.params = { id: productId };

      await productController.getProduct(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockGetProductUseCase.execute).toHaveBeenCalledWith(productId);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Product not found",
      });
    });

    it("should return 500 when use case throws error", async () => {
      const productId = "test-id";
      mockGetProductUseCase.execute.mockRejectedValue(
        new Error("Database error")
      );
      mockRequest.params = { id: productId };

      await productController.getProduct(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Database error",
      });
    });
  });

  describe("getAllProducts", () => {
    it("should return all products", async () => {
      const products = [
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

      mockGetAllProductsUseCase.execute.mockResolvedValue(products);

      await productController.getAllProducts(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockGetAllProductsUseCase.execute).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        products.map((p) => p.toJSON())
      );
    });

    it("should return 500 when use case throws error", async () => {
      mockGetAllProductsUseCase.execute.mockRejectedValue(
        new Error("Database error")
      );

      await productController.getAllProducts(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Database error",
      });
    });
  });

  describe("getProductsByCategory", () => {
    it("should return products by category", async () => {
      const category = "Electronics";
      const products = [
        new Product({
          name: "Product 1",
          description: "First product",
          price: 19.99,
          category: "Electronics",
          inStock: 50,
        }),
      ];

      mockGetProductsByCategoryUseCase.execute.mockResolvedValue(products);
      mockRequest.params = { category };

      await productController.getProductsByCategory(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockGetProductsByCategoryUseCase.execute).toHaveBeenCalledWith(
        category
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        products.map((p) => p.toJSON())
      );
    });

    it("should return 500 when use case throws error", async () => {
      const category = "Electronics";
      mockGetProductsByCategoryUseCase.execute.mockRejectedValue(
        new Error("Database error")
      );
      mockRequest.params = { category };

      await productController.getProductsByCategory(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Database error",
      });
    });
  });

  describe("updateProduct", () => {
    it("should update product successfully", async () => {
      const productId = "test-id";
      const updateData = { name: "Updated Product" };
      const updatedProduct = new Product({
        name: "Updated Product",
        description: "A test product",
        price: 29.99,
        category: "Electronics",
        inStock: 100,
      });

      mockUpdateProductUseCase.execute.mockResolvedValue(updatedProduct);
      mockRequest.params = { id: productId };
      mockRequest.body = updateData;

      await productController.updateProduct(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockUpdateProductUseCase.execute).toHaveBeenCalledWith(
        productId,
        updateData
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedProduct.toJSON());
    });

    it("should return 404 when product not found", async () => {
      const productId = "non-existent-id";
      const updateData = { name: "Updated Product" };

      mockUpdateProductUseCase.execute.mockResolvedValue(null);
      mockRequest.params = { id: productId };
      mockRequest.body = updateData;

      await productController.updateProduct(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockUpdateProductUseCase.execute).toHaveBeenCalledWith(
        productId,
        updateData
      );
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Product not found",
      });
    });

    it("should return 400 when validation fails", async () => {
      const productId = "test-id";
      const updateData = { name: "" };

      mockUpdateProductUseCase.execute.mockRejectedValue(
        new Error("Product name cannot be empty")
      );
      mockRequest.params = { id: productId };
      mockRequest.body = updateData;

      await productController.updateProduct(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Product name cannot be empty",
      });
    });
  });

  describe("deleteProduct", () => {
    it("should delete product successfully", async () => {
      const productId = "test-id";
      mockDeleteProductUseCase.execute.mockResolvedValue(true);
      mockRequest.params = { id: productId };

      await productController.deleteProduct(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockDeleteProductUseCase.execute).toHaveBeenCalledWith(productId);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.end).toHaveBeenCalled();
    });

    it("should return 404 when product not found", async () => {
      const productId = "non-existent-id";
      mockDeleteProductUseCase.execute.mockResolvedValue(false);
      mockRequest.params = { id: productId };

      await productController.deleteProduct(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockDeleteProductUseCase.execute).toHaveBeenCalledWith(productId);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Product not found",
      });
    });

    it("should return 500 when use case throws error", async () => {
      const productId = "test-id";
      mockDeleteProductUseCase.execute.mockRejectedValue(
        new Error("Database error")
      );
      mockRequest.params = { id: productId };

      await productController.deleteProduct(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Database error",
      });
    });
  });
});
