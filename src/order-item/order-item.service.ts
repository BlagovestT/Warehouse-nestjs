import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  OrderItem,
  CreateOrderItemData,
  UpdateOrderItemData,
} from './order-item.entity';
import { BaseService } from '../common/services/base.service';

@Injectable()
export class OrderItemService extends BaseService<OrderItem> {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {
    super(orderItemRepository);
  }

  protected getEntityName(): string {
    return 'OrderItem';
  }

  // CRUD
  async getAllOrderItems(): Promise<OrderItem[]> {
    return this.getAll();
  }

  async getOrderItemById(id: string): Promise<OrderItem> {
    return this.getById(id);
  }

  async createOrderItem(
    orderItemData: CreateOrderItemData,
  ): Promise<OrderItem> {
    const { orderId, productId } = orderItemData;

    const existingOrderItem = await this.orderItemRepository.findOne({
      where: { orderId, productId },
    });

    if (existingOrderItem) {
      throw new ConflictException('Order item already exists');
    }

    const orderItem = this.orderItemRepository.create(orderItemData);
    return await this.orderItemRepository.save(orderItem);
  }

  async updateOrderItem(
    id: string,
    updateData: UpdateOrderItemData,
  ): Promise<OrderItem> {
    const orderItem = await this.getOrderItemById(id);

    if (updateData.productId && updateData.productId !== orderItem.productId) {
      const existingOrderItem = await this.orderItemRepository.findOne({
        where: { orderId: orderItem.orderId, productId: updateData.productId },
      });

      if (existingOrderItem) {
        throw new ConflictException('Product already exists in this order');
      }
    }

    await this.orderItemRepository.update(id, updateData);
    return await this.getOrderItemById(id);
  }

  async deleteOrderItem(id: string): Promise<{ message: string }> {
    return this.deleteById(id);
  }
}
