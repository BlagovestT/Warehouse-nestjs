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
import { OrderService } from './order.service';
import { CreateOrderData, UpdateOrderData } from './order.entity';
import { createOrderSchema, updateOrderSchema } from './order.schema';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../common/guards/jwt.guard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // GET /api/order - Get all orders (Protected)
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllOrders() {
    return await this.orderService.getAllOrders();
  }

  // GET /api/order/:id - Get order by ID (Protected)
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOrderById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.orderService.getOrderById(id);
  }

  // POST /api/order - Create new order (Protected)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(createOrderSchema))
  async createOrder(@Body() orderData: CreateOrderData) {
    const newOrder = await this.orderService.createOrder(orderData);

    return {
      message: 'Order created successfully',
      order: newOrder,
    };
  }

  // PUT /api/order/:id - Update order (Protected)
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(updateOrderSchema))
  async updateOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: UpdateOrderData,
  ) {
    const updatedOrder = await this.orderService.updateOrder(id, updateData);

    return {
      message: 'Order updated successfully',
      order: updatedOrder,
    };
  }

  // DELETE /api/order/:id - Delete order (Protected)
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteOrder(@Param('id', ParseUUIDPipe) id: string) {
    return await this.orderService.deleteOrder(id);
  }
}
