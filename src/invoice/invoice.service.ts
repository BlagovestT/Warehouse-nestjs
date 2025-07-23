import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Invoice,
  CreateInvoiceData,
  UpdateInvoiceData,
} from './invoice.entity';
import { BaseService } from '../common/services/base.service';

@Injectable()
export class InvoiceService extends BaseService<Invoice> {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
  ) {
    super(invoiceRepository);
  }

  protected getEntityName(): string {
    return 'Invoice';
  }

  // CRUD
  async getAllInvoices(): Promise<Invoice[]> {
    return this.getAll();
  }

  async getInvoiceById(id: string): Promise<Invoice> {
    return this.getById(id);
  }

  async createInvoice(invoiceData: CreateInvoiceData): Promise<Invoice> {
    const { invoiceNumber } = invoiceData;

    const existingInvoice = await this.invoiceRepository.findOne({
      where: { invoiceNumber },
    });

    if (existingInvoice) {
      throw new ConflictException('Invoice already exists');
    }

    const invoice = this.invoiceRepository.create(invoiceData);
    return await this.invoiceRepository.save(invoice);
  }

  async updateInvoice(
    id: string,
    updateData: UpdateInvoiceData,
  ): Promise<Invoice> {
    const invoice = await this.getInvoiceById(id);

    if (
      updateData.invoiceNumber &&
      updateData.invoiceNumber !== invoice.invoiceNumber
    ) {
      const existingInvoice = await this.invoiceRepository.findOne({
        where: { invoiceNumber: updateData.invoiceNumber },
      });

      if (existingInvoice) {
        throw new ConflictException('Invoice number already exists');
      }
    }

    await this.invoiceRepository.update(id, updateData);
    return await this.getInvoiceById(id);
  }

  async deleteInvoice(id: string): Promise<{ message: string }> {
    return this.deleteById(id);
  }
}
