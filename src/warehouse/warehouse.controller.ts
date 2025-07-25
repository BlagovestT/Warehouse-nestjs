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
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseData, UpdateWarehouseData } from './warehouse.entity';
import {
  createWarehouseSchema,
  updateWarehouseSchema,
} from './warehouse.schema';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from '../common/enums/role.enum';
import { HighestStockResult } from 'src/common/interfaces/warehouse.interface';
import { UserFromToken } from '../common/guards/jwt.guard';

@ApiTags('Warehouses')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Get()
  @Roles(Role.VIEWER, Role.OPERATOR, Role.OWNER)
  @ApiOperation({ summary: "Get all warehouses from current user's company" })
  @ApiResponse({
    status: 200,
    description: 'List of warehouses from your company retrieved successfully',
  })
  async getAllWarehouses(@GetUser() currentUser: UserFromToken) {
    return await this.warehouseService.getAllWarehouses(currentUser.companyId);
  }

  @Get('highest-stock')
  @Roles(Role.VIEWER, Role.OPERATOR, Role.OWNER)
  @ApiTags('Reports')
  @ApiOperation({
    summary:
      "Get product with highest stock per warehouse from current user's company",
  })
  @ApiResponse({
    status: 200,
    description:
      'Product with highest stock from your company retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            warehouse: { type: 'string' },
            productName: { type: 'string' },
            currentStock: { type: 'string' },
          },
        },
      },
    },
  })
  async getHighestStock(@GetUser() currentUser: UserFromToken): Promise<{
    message: string;
    data: HighestStockResult;
  }> {
    const highestStock = await this.warehouseService.getProductWithHighestStock(
      currentUser.companyId,
    );
    return {
      message: 'Product with highest stock retrieved successfully',
      data: highestStock,
    };
  }

  @Get(':id')
  @Roles(Role.VIEWER, Role.OPERATOR, Role.OWNER)
  @ApiOperation({ summary: 'Get warehouse by ID (must be from same company)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Warehouse retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Warehouse not found' })
  @ApiResponse({
    status: 403,
    description: 'Access denied - warehouse not from your company',
  })
  async getWarehouseById(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() currentUser: UserFromToken,
  ) {
    return await this.warehouseService.getWarehouseById(
      id,
      currentUser.companyId,
    );
  }

  @Post()
  @Roles(Role.OPERATOR, Role.OWNER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new warehouse' })
  @ApiBody({
    description: 'Warehouse creation data',
    schema: {
      type: 'object',
      required: ['companyId', 'supportType', 'name'],
      properties: {
        companyId: { type: 'string', format: 'uuid' },
        supportType: { type: 'string', enum: ['solid', 'liquid', 'mixed'] },
        name: { type: 'string', minLength: 2, maxLength: 255 },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Warehouse created successfully' })
  @ApiResponse({
    status: 409,
    description: 'Warehouse name already exists in your company',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied - OPERATOR or OWNER role required',
  })
  async createWarehouse(
    @Body(new ZodValidationPipe(createWarehouseSchema))
    warehouseData: CreateWarehouseData,
    @GetUser() currentUser: UserFromToken,
  ) {
    const newWarehouse = await this.warehouseService.createWarehouse(
      warehouseData,
      currentUser.id,
    );

    return {
      message: 'Warehouse created successfully',
      warehouse: newWarehouse,
    };
  }

  @Put(':id')
  @Roles(Role.OPERATOR, Role.OWNER)
  @ApiOperation({ summary: 'Update warehouse (must be from same company)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiBody({
    description: 'Warehouse update data',
    schema: {
      type: 'object',
      properties: {
        supportType: { type: 'string', enum: ['solid', 'liquid', 'mixed'] },
        name: { type: 'string', minLength: 2, maxLength: 255 },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Warehouse updated successfully' })
  @ApiResponse({
    status: 403,
    description:
      'Access denied - warehouse not from your company or insufficient role',
  })
  async updateWarehouse(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateWarehouseSchema))
    updateData: UpdateWarehouseData,
    @GetUser() currentUser: UserFromToken,
  ) {
    const updatedWarehouse = await this.warehouseService.updateWarehouse(
      id,
      updateData,
      currentUser.id,
      currentUser.companyId,
    );

    return {
      message: 'Warehouse updated successfully',
      warehouse: updatedWarehouse,
    };
  }

  @Delete(':id')
  @Roles(Role.OWNER)
  @ApiOperation({
    summary: 'Delete warehouse (must be from same company, OWNER only)',
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Warehouse deleted successfully' })
  @ApiResponse({
    status: 403,
    description:
      'Access denied - warehouse not from your company or OWNER role required',
  })
  async deleteWarehouse(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() currentUser: UserFromToken,
  ) {
    return await this.warehouseService.deleteWarehouse(
      id,
      currentUser.companyId,
    );
  }
}
