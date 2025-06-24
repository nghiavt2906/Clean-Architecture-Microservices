import { Product, ProductProperties } from "../../domain/entities/product";

export interface CreateProductUseCase {
  execute(
    productData: Omit<ProductProperties, "id" | "createdAt" | "updatedAt">
  ): Promise<Product>;
}

export interface GetProductUseCase {
  execute(id: string): Promise<Product | null>;
}

export interface GetAllProductsUseCase {
  execute(): Promise<Product[]>;
}

export interface GetProductsByCategoryUseCase {
  execute(category: string): Promise<Product[]>;
}

export interface UpdateProductUseCase {
  execute(
    id: string,
    productData: Partial<ProductProperties>
  ): Promise<Product | null>;
}

export interface DeleteProductUseCase {
  execute(id: string): Promise<boolean>;
}
