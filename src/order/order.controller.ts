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
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderData, UpdateOrderData } from './order.entity';
import { createOrderSchema, updateOrderSchema } from './order.schema';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from '../common/enums/role.enum';
import { UserFromToken } from '../common/guards/jwt.guard';

@ApiTags('Orders')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @Roles(Role.VIEWER, Role.OPERATOR, Role.OWNER)
  @ApiOperation({ summary: "Get all orders from current user's company" })
  @ApiResponse({
    status: 200,
    description: 'List of orders from your company retrieved successfully',
  })
  async getAllOrders(@GetUser() currentUser: UserFromToken) {
    return await this.orderService.getAllOrders(currentUser.companyId);
  }

  @Get(':id')
  @Roles(Role.VIEWER, Role.OPERATOR, Role.OWNER)
  @ApiOperation({ summary: 'Get order by ID (must be from same company)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({
    status: 403,
    description: 'Access denied - order not from your company',
  })
  async getOrderById(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() currentUser: UserFromToken,
  ) {
    return await this.orderService.getOrderById(id, currentUser.companyId);
  }

  @Post()
  @Roles(Role.OPERATOR, Role.OWNER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new order' })
  @ApiBody({
    description: 'Order creation data',
    schema: {
      type: 'object',
      required: [
        'companyId',
        'warehouseId',
        'businessPartnerId',
        'orderNumber',
        'type',
      ],
      properties: {
        companyId: { type: 'string', format: 'uuid' },
        warehouseId: { type: 'string', format: 'uuid' },
        businessPartnerId: { type: 'string', format: 'uuid' },
        orderNumber: { type: 'string', minLength: 1, maxLength: 255 },
        type: { type: 'string', enum: ['shipment', 'delivery'] },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({
    status: 409,
    description: 'Order number already exists in your company',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied - OPERATOR or OWNER role required',
  })
  async createOrder(
    @Body(new ZodValidationPipe(createOrderSchema)) orderData: CreateOrderData,
    @GetUser() currentUser: UserFromToken,
  ) {
    const newOrder = await this.orderService.createOrder(
      orderData,
      currentUser.id,
    );

    return {
      message: 'Order created successfully',
      order: newOrder,
    };
  }

  @Put(':id')
  @Roles(Role.OPERATOR, Role.OWNER)
  @ApiOperation({ summary: 'Update order (must be from same company)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiBody({
    description: 'Order update data',
    schema: {
      type: 'object',
      properties: {
        warehouseId: { type: 'string', format: 'uuid' },
        businessPartnerId: { type: 'string', format: 'uuid' },
        orderNumber: { type: 'string', minLength: 1, maxLength: 255 },
        type: { type: 'string', enum: ['shipment', 'delivery'] },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Order updated successfully' })
  @ApiResponse({
    status: 403,
    description:
      'Access denied - order not from your company or insufficient role',
  })
  async updateOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateOrderSchema)) updateData: UpdateOrderData,
    @GetUser() currentUser: UserFromToken,
  ) {
    const updatedOrder = await this.orderService.updateOrder(
      id,
      updateData,
      currentUser.id,
      currentUser.companyId,
    );

    return {
      message: 'Order updated successfully',
      order: updatedOrder,
    };
  }

  @Delete(':id')
  @Roles(Role.OWNER)
  @ApiOperation({
    summary: 'Delete order (must be from same company, OWNER only)',
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Order deleted successfully' })
  @ApiResponse({
    status: 403,
    description:
      'Access denied - order not from your company or OWNER role required',
  })
  async deleteOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() currentUser: UserFromToken,
  ) {
    return await this.orderService.deleteOrder(id, currentUser.companyId);
  }
}
