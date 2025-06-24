import mongoose from "mongoose";

export interface ProductProperties {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Product {
  private readonly _id: string;
  private _name: string;
  private _description: string;
  private _price: number;
  private _category: string;
  private _inStock: number;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: ProductProperties) {
    this._id = props._id || new mongoose.Types.ObjectId().toString();
    this._name = props.name;
    this._description = props.description;
    this._price = props.price;
    this._category = props.category;
    this._inStock = props.inStock;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();

    this.validate();
  }

  // Pure domain validation logic
  private validate(): void {
    if (this._name.trim().length === 0) {
      throw new Error("Product name cannot be empty");
    }

    if (this._price <= 0) {
      throw new Error("Product price must be greater than zero");
    }

    if (this._inStock < 0) {
      throw new Error("Stock quantity cannot be negative");
    }
  }

  // Domain behavior methods
  public updateStock(quantity: number): void {
    const newStock = this._inStock + quantity;
    if (newStock < 0) {
      throw new Error("Cannot reduce stock below zero");
    }
    this._inStock = newStock;
    this._updatedAt = new Date();
  }

  public updateDetails(
    name?: string,
    description?: string,
    price?: number,
    category?: string
  ): void {
    if (name !== undefined) this._name = name;
    if (description !== undefined) this._description = description;
    if (price !== undefined) this._price = price;
    if (category !== undefined) this._category = category;
    this._updatedAt = new Date();

    this.validate();
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get price(): number {
    return this._price;
  }

  get category(): string {
    return this._category;
  }

  get inStock(): number {
    return this._inStock;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Method to convert entity to plain object (for persistence/presentation)
  public toJSON(): ProductProperties {
    return {
      _id: this._id,
      name: this._name,
      description: this._description,
      price: this._price,
      category: this._category,
      inStock: this._inStock,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
