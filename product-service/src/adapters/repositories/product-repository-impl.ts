import { Product, ProductProperties } from "../../domain/entities/product";
import { ProductRepository } from "../../domain/interfaces/product-repository";
import { ProductModel } from "../../frameworks/database/models/product-model";

export class ProductRepositoryImpl implements ProductRepository {
  async findAll(): Promise<Product[]> {
    const productModels = await ProductModel.find().lean();
    return productModels.map(
      (model: any) => new Product(model as ProductProperties)
    );
  }

  async findById(id: string): Promise<Product | null> {
    const productModel = await ProductModel.findById(id).lean();
    return productModel ? new Product(productModel as ProductProperties) : null;
  }

  async findByCategory(category: string): Promise<Product[]> {
    const productModels = await ProductModel.find({ category }).lean();
    return productModels.map(
      (model: any) => new Product(model as ProductProperties)
    );
  }

  async save(product: Product): Promise<Product> {
    const productData = product.toJSON();
    const savedModel = await ProductModel.create(productData);
    return new Product(savedModel.toObject() as ProductProperties);
  }

  async update(product: Product): Promise<Product> {
    const productData = product.toJSON();
    const updatedModel = await ProductModel.findByIdAndUpdate(
      product.id,
      productData,
      { new: true }
    ).lean();

    if (!updatedModel) {
      throw new Error(`Product with id ${product.id} not found`);
    }

    return new Product(updatedModel as ProductProperties);
  }

  async delete(id: string): Promise<boolean> {
    const result = await ProductModel.findByIdAndDelete(id);
    return result !== null;
  }
}
