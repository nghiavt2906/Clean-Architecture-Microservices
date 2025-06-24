import mongoose from "mongoose";

export enum OrderStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export interface OrderItemProperties {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export class OrderItem {
  private readonly _productId: string;
  private readonly _productName: string;
  private readonly _quantity: number;
  private readonly _unitPrice: number;

  constructor(props: OrderItemProperties) {
    this._productId = props.productId;
    this._productName = props.productName;
    this._quantity = props.quantity;
    this._unitPrice = props.unitPrice;

    this.validate();
  }

  private validate(): void {
    if (this._quantity <= 0) {
      throw new Error("Order item quantity must be greater than zero");
    }
    if (this._unitPrice <= 0) {
      throw new Error("Unit price must be greater than zero");
    }
  }

  get productId(): string {
    return this._productId;
  }

  get productName(): string {
    return this._productName;
  }

  get quantity(): number {
    return this._quantity;
  }

  get unitPrice(): number {
    return this._unitPrice;
  }

  get subtotal(): number {
    return this._quantity * this._unitPrice;
  }

  public toJSON(): OrderItemProperties {
    return {
      productId: this._productId,
      productName: this._productName,
      quantity: this._quantity,
      unitPrice: this._unitPrice,
    };
  }
}

export interface OrderProperties {
  _id?: string;
  customerId: string;
  items: OrderItemProperties[];
  status?: OrderStatus;
  totalAmount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Order {
  private readonly _id: string;
  private readonly _customerId: string;
  private readonly _items: OrderItem[];
  private _status: OrderStatus;
  private readonly _totalAmount: number;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: OrderProperties) {
    this._id = props._id || new mongoose.Types.ObjectId().toString();
    this._customerId = props.customerId;
    this._items = props.items.map((item) => new OrderItem(item));
    this._status = props.status || OrderStatus.PENDING;
    this._totalAmount = this.calculateTotal();
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();

    this.validate();
  }

  private validate(): void {
    if (this._items.length === 0) {
      throw new Error("Order must contain at least one item");
    }
  }

  private calculateTotal(): number {
    return this._items.reduce((total, item) => total + item.subtotal, 0);
  }

  public updateStatus(newStatus: OrderStatus): void {
    if (this._status === OrderStatus.CANCELLED) {
      throw new Error("Cannot update status of a cancelled order");
    }

    if (
      this._status === OrderStatus.DELIVERED &&
      newStatus !== OrderStatus.CANCELLED
    ) {
      throw new Error("Cannot update status of a delivered order");
    }

    this._status = newStatus;
    this._updatedAt = new Date();
  }

  get id(): string {
    return this._id;
  }

  get customerId(): string {
    return this._customerId;
  }

  get items(): OrderItem[] {
    return [...this._items];
  }

  get status(): OrderStatus {
    return this._status;
  }

  get totalAmount(): number {
    return this._totalAmount;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  public toJSON() {
    return {
      _id: this._id,
      customerId: this._customerId,
      items: this._items.map((item) => item.toJSON()),
      status: this._status,
      totalAmount: this._totalAmount,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
