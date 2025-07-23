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
import { InvoiceService } from './invoice.service';
import { CreateInvoiceData, UpdateInvoiceData } from './invoice.entity';
import { createInvoiceSchema, updateInvoiceSchema } from './invoice.schema';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../common/guards/jwt.guard';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  // GET /api/invoice - Get all invoices (Protected)
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllInvoices() {
    return await this.invoiceService.getAllInvoices();
  }

  // GET /api/invoice/:id - Get invoice by ID (Protected)
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getInvoiceById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.invoiceService.getInvoiceById(id);
  }

  // POST /api/invoice - Create new invoice (Protected)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(createInvoiceSchema))
  async createInvoice(@Body() invoiceData: CreateInvoiceData) {
    const newInvoice = await this.invoiceService.createInvoice(invoiceData);

    return {
      message: 'Invoice created successfully',
      invoice: newInvoice,
    };
  }

  // PUT /api/invoice/:id - Update invoice (Protected)
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(updateInvoiceSchema))
  async updateInvoice(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: UpdateInvoiceData,
  ) {
    const updatedInvoice = await this.invoiceService.updateInvoice(
      id,
      updateData,
    );

    return {
      message: 'Invoice updated successfully',
      invoice: updatedInvoice,
    };
  }

  // DELETE /api/invoice/:id - Delete invoice (Protected)
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteInvoice(@Param('id', ParseUUIDPipe) id: string) {
    return await this.invoiceService.deleteInvoice(id);
  }
}
