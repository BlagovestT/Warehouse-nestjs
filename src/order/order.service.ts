import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, CreateOrderData, UpdateOrderData } from './order.entity';
import { BaseService } from '../common/services/base.service';

@Injectable()
export class OrderService extends BaseService<Order> {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {
    super(orderRepository);
  }

  protected getEntityName(): string {
    return 'Order';
  }

  // CRUD
  async getAllOrders(): Promise<Order[]> {
    return this.getAll();
  }

  async getOrderById(id: string): Promise<Order> {
    return this.getById(id);
  }

  async createOrder(orderData: CreateOrderData): Promise<Order> {
    const { orderNumber } = orderData;

    const existingOrder = await this.orderRepository.findOne({
      where: { orderNumber },
    });

    if (existingOrder) {
      throw new ConflictException('Order already exists');
    }

    const order = this.orderRepository.create(orderData);
    return await this.orderRepository.save(order);
  }

  async updateOrder(id: string, updateData: UpdateOrderData): Promise<Order> {
    const order = await this.getOrderById(id);

    if (
      updateData.orderNumber &&
      updateData.orderNumber !== order.orderNumber
    ) {
      const existingOrder = await this.orderRepository.findOne({
        where: { orderNumber: updateData.orderNumber },
      });

      if (existingOrder) {
        throw new ConflictException('Order number already exists');
      }
    }

    await this.orderRepository.update(id, updateData);
    return await this.getOrderById(id);
  }

  async deleteOrder(id: string): Promise<{ message: string }> {
    return this.deleteById(id);
  }
}
