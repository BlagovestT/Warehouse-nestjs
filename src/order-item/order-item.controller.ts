import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { OrderItemService } from './order-item.service';
import { CreateOrderItemData, UpdateOrderItemData } from './order-item.entity';
import {
  createOrderItemSchema,
  updateOrderItemSchema,
} from './order-item.schema';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from '../common/enums/role.enum';
import { UserFromToken } from '../common/guards/jwt.guard';

@ApiTags('Order Items')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('order-item')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Get()
  @Roles(Role.VIEWER, Role.OPERATOR, Role.OWNER)
  @ApiOperation({
    summary: "Get all order items from current user's company orders",
  })
  @ApiResponse({
    status: 200,
    description: 'List of order items from your company retrieved successfully',
  })
  async getAllOrderItems(@GetUser() currentUser: UserFromToken) {
    return await this.orderItemService.getAllOrderItems(currentUser.companyId);
  }

  @Get(':id')
  @Roles(Role.VIEWER, Role.OPERATOR, Role.OWNER)
  @ApiOperation({
    summary: 'Get order item by ID (must be from same company order)',
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Order item retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Order item not found' })
  @ApiResponse({
    status: 403,
    description: 'Access denied - order item not from your company',
  })
  async getOrderItemById(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() currentUser: UserFromToken,
  ) {
    return await this.orderItemService.getOrderItemById(
      id,
      currentUser.companyId,
    );
  }

  @Post()
  @Roles(Role.OPERATOR, Role.OWNER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new order item (order must be from same company)',
  })
  @ApiBody({
    description: 'Order item creation data',
    schema: {
      type: 'object',
      required: ['orderId', 'productId', 'quantity'],
      properties: {
        orderId: { type: 'string', format: 'uuid' },
        productId: { type: 'string', format: 'uuid' },
        quantity: { type: 'number', minimum: 1 },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Order item created successfully' })
  @ApiResponse({
    status: 409,
    description: 'Order item already exists for this product in this order',
  })
  @ApiResponse({
    status: 403,
    description:
      'Access denied - order not from your company or insufficient role',
  })
  async createOrderItem(
    @Body(new ZodValidationPipe(createOrderItemSchema))
    orderItemData: CreateOrderItemData,
    @GetUser() currentUser: UserFromToken,
  ) {
    const newOrderItem = await this.orderItemService.createOrderItem(
      orderItemData,
      currentUser.id,
      currentUser.companyId,
    );
    return {
      message: 'Order item created successfully',
      orderItem: newOrderItem,
    };
  }

  @Put(':id')
  @Roles(Role.OPERATOR, Role.OWNER)
  @ApiOperation({
    summary: 'Update order item by ID (must be from same company order)',
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiBody({
    description: 'Order item update data',
    schema: {
      type: 'object',
      properties: {
        productId: { type: 'string', format: 'uuid' },
        quantity: { type: 'number', minimum: 1 },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Order item updated successfully' })
  @ApiResponse({ status: 404, description: 'Order item not found' })
  @ApiResponse({
    status: 403,
    description:
      'Access denied - order item not from your company or insufficient role',
  })
  async updateOrderItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateOrderItemSchema))
    updateData: UpdateOrderItemData,
    @GetUser() currentUser: UserFromToken,
  ) {
    const updatedOrderItem = await this.orderItemService.updateOrderItem(
      id,
      updateData,
      currentUser.id,
      currentUser.companyId,
    );

    return {
      message: 'Order item updated successfully',
      orderItem: updatedOrderItem,
    };
  }

  @Delete(':id')
  @Roles(Role.OWNER)
  @ApiOperation({
    summary:
      'Delete order item by ID (must be from same company order, OWNER only)',
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Order item deleted successfully' })
  @ApiResponse({ status: 404, description: 'Order item not found' })
  @ApiResponse({
    status: 403,
    description:
      'Access denied - order item not from your company or OWNER role required',
  })
  async deleteOrderItem(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() currentUser: UserFromToken,
  ) {
    return await this.orderItemService.deleteOrderItem(
      id,
      currentUser.companyId,
    );
  }
}
