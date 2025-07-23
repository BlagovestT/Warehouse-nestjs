import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  UsePipes,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { CreateOrderItemData, UpdateOrderItemData } from './order-item.entity';
import {
  createOrderItemSchema,
  updateOrderItemSchema,
} from './order-item.schema';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../common/guards/jwt.guard';

@Controller('order-item')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  // GET /api/order-item - Get all order items (Protected)
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllOrderItems() {
    return await this.orderItemService.getAllOrderItems();
  }

  // GET /api/order-item/:id - Get order item by ID (Protected)
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOrderItemById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.orderItemService.getOrderItemById(id);
  }

  // POST /api/order-item - Create new order item (Protected)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(createOrderItemSchema))
  async createOrderItem(@Body() orderItemData: CreateOrderItemData) {
    const newOrderItem =
      await this.orderItemService.createOrderItem(orderItemData);

    return {
      message: 'Order item created successfully',
      orderItem: newOrderItem,
    };
  }

  // PUT /api/order-item/:id - Update order item (Protected)
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(updateOrderItemSchema))
  async updateOrderItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: UpdateOrderItemData,
  ) {
    const updatedOrderItem = await this.orderItemService.updateOrderItem(
      id,
      updateData,
    );

    return {
      message: 'Order item updated successfully',
      orderItem: updatedOrderItem,
    };
  }

  // DELETE /api/order-item/:id - Delete order item (Protected)
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteOrderItem(@Param('id', ParseUUIDPipe) id: string) {
    return await this.orderItemService.deleteOrderItem(id);
  }
}
