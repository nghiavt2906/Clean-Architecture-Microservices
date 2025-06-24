import mongoose, { Schema, Document } from "mongoose";
import { OrderStatus } from "../../../domain/entities/order";

interface OrderItemDocument {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface OrderDocument extends Document {
  customerId: string;
  items: OrderItemDocument[];
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<OrderItemDocument>({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
});

const orderSchema = new Schema<OrderDocument>(
  {
    customerId: { type: String, required: true, index: true },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: [
        (val: OrderItemDocument[]) => val.length > 0,
        "Order must have at least one item",
      ],
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

export const OrderModel = mongoose.model<OrderDocument>("Order", orderSchema);
