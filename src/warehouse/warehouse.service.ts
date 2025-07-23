import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Warehouse,
  CreateWarehouseData,
  UpdateWarehouseData,
} from './warehouse.entity';
import { BaseService } from '../common/services/base.service';

@Injectable()
export class WarehouseService extends BaseService<Warehouse> {
  constructor(
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
  ) {
    super(warehouseRepository);
  }

  protected getEntityName(): string {
    return 'Warehouse';
  }

  // CRUD
  async getAllWarehouses(): Promise<Warehouse[]> {
    return this.getAll();
  }

  async getWarehouseById(id: string): Promise<Warehouse> {
    return this.getById(id);
  }

  async createWarehouse(
    warehouseData: CreateWarehouseData,
  ): Promise<Warehouse> {
    const { name } = warehouseData;

    const existingWarehouse = await this.warehouseRepository.findOne({
      where: { name },
    });

    if (existingWarehouse) {
      throw new ConflictException('Warehouse already exists');
    }

    const warehouse = this.warehouseRepository.create(warehouseData);
    return await this.warehouseRepository.save(warehouse);
  }

  async updateWarehouse(
    id: string,
    updateData: UpdateWarehouseData,
  ): Promise<Warehouse> {
    const warehouse = await this.getWarehouseById(id);

    if (updateData.name && updateData.name !== warehouse.name) {
      const existingWarehouse = await this.warehouseRepository.findOne({
        where: { name: updateData.name },
      });

      if (existingWarehouse) {
        throw new ConflictException('Name already exists');
      }
    }

    await this.warehouseRepository.update(id, updateData);
    return await this.getWarehouseById(id);
  }

  async deleteWarehouse(id: string): Promise<{ message: string }> {
    return this.deleteById(id);
  }
}
