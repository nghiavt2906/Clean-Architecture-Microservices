import { Request, Response } from "express";
import {
  CreateProductUseCase,
  GetProductUseCase,
  GetAllProductsUseCase,
  GetProductsByCategoryUseCase,
  UpdateProductUseCase,
  DeleteProductUseCase,
} from "../../usecases/interfaces/product-use-cases";

export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly getProductUseCase: GetProductUseCase,
    private readonly getAllProductsUseCase: GetAllProductsUseCase,
    private readonly getProductsByCategoryUseCase: GetProductsByCategoryUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase
  ) {}

  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const productData = req.body;
      const product = await this.createProductUseCase.execute(productData);
      res.status(201).json(product.toJSON());
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const product = await this.getProductUseCase.execute(id);

      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }

      res.status(200).json(product.toJSON());
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await this.getAllProductsUseCase.execute();
      res.status(200).json(products.map((product) => product.toJSON()));
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getProductsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { category } = req.params;
      const products = await this.getProductsByCategoryUseCase.execute(
        category
      );
      res.status(200).json(products.map((product) => product.toJSON()));
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const productData = req.body;
      const product = await this.updateProductUseCase.execute(id, productData);

      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }

      res.status(200).json(product.toJSON());
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.deleteProductUseCase.execute(id);

      if (!result) {
        res.status(404).json({ error: "Product not found" });
        return;
      }

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
