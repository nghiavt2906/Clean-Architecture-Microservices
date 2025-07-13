import axios from "axios";
import {
  ProductService,
  ProductAvailability,
} from "../../domain/interfaces/product-service";

export class ProductServiceImpl implements ProductService {
  private readonly productServiceUrl: string;

  constructor(productServiceUrl: string) {
    this.productServiceUrl = productServiceUrl;
  }

  async checkProductAvailability(
    productId: string
  ): Promise<ProductAvailability | null> {
    try {
      const response = await axios.get(
        `${this.productServiceUrl}/api/products/${productId}`
      );
      const product = response.data;

      return {
        id: product.id,
        name: product.name,
        inStock: product.inStock,
        price: product.price,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async updateProductStock(
    productId: string,
    quantityChange: number
  ): Promise<boolean> {
    try {
      const product = await this.checkProductAvailability(productId);

      if (!product) {
        return false;
      }

      const newStock = product.inStock + quantityChange;

      if (newStock < 0) {
        throw new Error(
          `Cannot reduce stock below zero for product ${productId}`
        );
      }

      await axios.patch(`${this.productServiceUrl}/api/products/${productId}`, {
        inStock: newStock,
      });

      return true;
    } catch (error) {
      console.error(`Failed to update product stock: ${error}`);
      return false;
    }
  }
}
