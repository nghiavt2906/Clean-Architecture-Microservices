import { Order, OrderProperties } from "../../domain/entities/order";
import { OrderRepository } from "../../domain/interfaces/order-repository";
import { OrderModel } from "../../frameworks/database/models/order-model";

export class OrderRepositoryImpl implements OrderRepository {
  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.find().lean();
    return orderModels.map((model) => new Order(model as OrderProperties));
  }

  async findById(id: string): Promise<Order | null> {
    const orderModel = await OrderModel.findById(id).lean();
    return orderModel ? new Order(orderModel as OrderProperties) : null;
  }

  async findByCustomerId(customerId: string): Promise<Order[]> {
    const orderModels = await OrderModel.find({ customerId }).lean();
    return orderModels.map((model) => new Order(model as OrderProperties));
  }

  async save(order: Order): Promise<Order> {
    const orderData = order.toJSON();
    const savedModel = await OrderModel.create(orderData);
    return new Order(savedModel.toObject() as OrderProperties);
  }

  async update(order: Order): Promise<Order> {
    const orderData = order.toJSON();
    const updatedModel = await OrderModel.findByIdAndUpdate(
      order.id,
      orderData,
      { new: true }
    ).lean();

    if (!updatedModel) {
      throw new Error(`Order with id ${order.id} not found`);
    }

    return new Order(updatedModel as OrderProperties);
  }

  async delete(id: string): Promise<boolean> {
    const result = await OrderModel.findByIdAndDelete(id);
    return result !== null;
  }
}
