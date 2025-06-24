import { Router } from "express";
import { ProductController } from "../../../adapters/controllers/product-controller";

export function setupProductRoutes(
  router: Router,
  productController: ProductController
): Router {
  // Bind methods to ensure correct 'this' context
  const createProduct = productController.createProduct.bind(productController);
  const getProduct = productController.getProduct.bind(productController);
  const getAllProducts =
    productController.getAllProducts.bind(productController);
  const getProductsByCategory =
    productController.getProductsByCategory.bind(productController);
  const updateProduct = productController.updateProduct.bind(productController);
  const deleteProduct = productController.deleteProduct.bind(productController);

  router.post("/products", createProduct);
  router.get("/products", getAllProducts);
  router.get("/products/:id", getProduct);
  router.get("/products/category/:category", getProductsByCategory);
  router.put("/products/:id", updateProduct);
  router.delete("/products/:id", deleteProduct);

  return router;
}
