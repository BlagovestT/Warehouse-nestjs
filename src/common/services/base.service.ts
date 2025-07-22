import { NotFoundException } from '@nestjs/common';
import { Repository, FindOptionsWhere } from 'typeorm';

export abstract class BaseService<T extends { id: string }> {
  protected repository: Repository<T>;

  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  // Common CRUD operations
  async getAll(): Promise<T[]> {
    const result = await this.repository.find();
    if (!result || result.length === 0) {
      throw new NotFoundException(`No ${this.getEntityName()} found`);
    }
    console.log(result);
    return result;
  }

  async getById(id: string): Promise<T> {
    const entity = await this.repository.findOne({
      where: { id } as FindOptionsWhere<T>,
    });
    if (!entity) {
      throw new NotFoundException(`${this.getEntityName()} not found`);
    }
    return entity;
  }

  async deleteById(id: string): Promise<{ message: string }> {
    const entity = await this.repository.findOne({
      where: { id } as FindOptionsWhere<T>,
    });
    if (!entity) {
      throw new NotFoundException(`${this.getEntityName()} not found`);
    }
    await this.repository.softDelete(id);
    return { message: `${this.getEntityName()} deleted successfully` };
  }

  // Abstract method to get entity name for error messages
  protected abstract getEntityName(): string;
}
