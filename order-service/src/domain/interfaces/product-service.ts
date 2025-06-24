export interface ProductAvailability {
  id: string;
  name: string;
  inStock: number;
  price: number;
}

export interface ProductService {
  checkProductAvailability(
    productId: string
  ): Promise<ProductAvailability | null>;
  updateProductStock(
    productId: string,
    quantityChange: number
  ): Promise<boolean>;
}
