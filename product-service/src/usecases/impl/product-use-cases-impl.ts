import { Product, ProductProperties } from "../../domain/entities/product";
import { ProductRepository } from "../../domain/interfaces/product-repository";
import {
  CreateProductUseCase,
  GetProductUseCase,
  GetAllProductsUseCase,
  GetProductsByCategoryUseCase,
  UpdateProductUseCase,
  DeleteProductUseCase,
} from "../interfaces/product-use-cases";

export class CreateProductUseCaseImpl implements CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(
    productData: Omit<ProductProperties, "id" | "createdAt" | "updatedAt">
  ): Promise<Product> {
    const product = new Product(productData);
    return this.productRepository.save(product);
  }
}

export class GetProductUseCaseImpl implements GetProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: string): Promise<Product | null> {
    return this.productRepository.findById(id);
  }
}

export class GetAllProductsUseCaseImpl implements GetAllProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.productRepository.findAll();
  }
}

export class GetProductsByCategoryUseCaseImpl
  implements GetProductsByCategoryUseCase
{
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(category: string): Promise<Product[]> {
    return this.productRepository.findByCategory(category);
  }
}

export class UpdateProductUseCaseImpl implements UpdateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(
    id: string,
    productData: Partial<ProductProperties>
  ): Promise<Product | null> {
    const existingProduct = await this.productRepository.findById(id);

    if (!existingProduct) {
      return null;
    }

    existingProduct.updateDetails(
      productData.name,
      productData.description,
      productData.price,
      productData.category
    );

    if (productData.inStock !== undefined) {
      const stockChange = productData.inStock - existingProduct.inStock;
      existingProduct.updateStock(stockChange);
    }

    return this.productRepository.update(existingProduct);
  }
}

export class DeleteProductUseCaseImpl implements DeleteProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: string): Promise<boolean> {
    return this.productRepository.delete(id);
  }
}
