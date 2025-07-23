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
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseData, UpdateWarehouseData } from './warehouse.entity';
import {
  createWarehouseSchema,
  updateWarehouseSchema,
} from './warehouse.schema';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../common/guards/jwt.guard';

@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  // GET /api/warehouse - Get all warehouses (Protected)
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllWarehouses() {
    return await this.warehouseService.getAllWarehouses();
  }

  // GET /api/warehouse/:id - Get warehouse by ID (Protected)
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getWarehouseById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.warehouseService.getWarehouseById(id);
  }

  // POST /api/warehouse - Create new warehouse (Protected)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(createWarehouseSchema))
  async createWarehouse(@Body() warehouseData: CreateWarehouseData) {
    const newWarehouse =
      await this.warehouseService.createWarehouse(warehouseData);

    return {
      message: 'Warehouse created successfully',
      warehouse: newWarehouse,
    };
  }

  // PUT /api/warehouse/:id - Update warehouse (Protected)
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(updateWarehouseSchema))
  async updateWarehouse(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: UpdateWarehouseData,
  ) {
    const updatedWarehouse = await this.warehouseService.updateWarehouse(
      id,
      updateData,
    );

    return {
      message: 'Warehouse updated successfully',
      warehouse: updatedWarehouse,
    };
  }

  // DELETE /api/warehouse/:id - Delete warehouse (Protected)
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteWarehouse(@Param('id', ParseUUIDPipe) id: string) {
    return await this.warehouseService.deleteWarehouse(id);
  }
}
