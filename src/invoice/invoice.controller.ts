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

import { InvoiceService } from './invoice.service';
import { CreateInvoiceData, UpdateInvoiceData } from './invoice.entity';
import { createInvoiceSchema, updateInvoiceSchema } from './invoice.schema';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from '../common/enums/role.enum';
import { UserFromToken } from '../common/guards/jwt.guard';

@ApiTags('Invoices')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get()
  @Roles(Role.VIEWER, Role.OPERATOR, Role.OWNER)
  @ApiOperation({ summary: "Get all invoices from current user's company" })
  @ApiResponse({
    status: 200,
    description: 'List of invoices from your company retrieved successfully',
  })
  async getAllInvoices(@GetUser() currentUser: UserFromToken) {
    return await this.invoiceService.getAllInvoices(currentUser.companyId);
  }

  @Get(':id')
  @Roles(Role.VIEWER, Role.OPERATOR, Role.OWNER)
  @ApiOperation({ summary: 'Get invoice by ID (must be from same company)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Invoice retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  @ApiResponse({
    status: 403,
    description: 'Access denied - invoice not from your company',
  })
  async getInvoiceById(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() currentUser: UserFromToken,
  ) {
    return await this.invoiceService.getInvoiceById(id, currentUser.companyId);
  }

  @Post()
  @Roles(Role.OPERATOR, Role.OWNER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new invoice' })
  @ApiBody({
    description: 'Invoice creation data',
    schema: {
      type: 'object',
      required: ['companyId', 'orderId', 'invoiceNumber', 'date'],
      properties: {
        companyId: { type: 'string', format: 'uuid' },
        orderId: { type: 'string', format: 'uuid' },
        invoiceNumber: { type: 'string', minLength: 1, maxLength: 255 },
        date: { type: 'string', format: 'date' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Invoice created successfully' })
  @ApiResponse({
    status: 409,
    description: 'Invoice number already exists in your company',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied - OPERATOR or OWNER role required',
  })
  async createInvoice(
    @Body(new ZodValidationPipe(createInvoiceSchema))
    invoiceData: CreateInvoiceData,
    @GetUser() currentUser: UserFromToken,
  ) {
    const newInvoice = await this.invoiceService.createInvoice(
      invoiceData,
      currentUser.id,
    );
    return {
      message: 'Invoice created successfully',
      invoice: newInvoice,
    };
  }

  @Put(':id')
  @Roles(Role.OPERATOR, Role.OWNER)
  @ApiOperation({ summary: 'Update invoice by ID (must be from same company)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiBody({
    description: 'Invoice update data',
    schema: {
      type: 'object',
      properties: {
        invoiceNumber: { type: 'string', minLength: 1, maxLength: 255 },
        date: { type: 'string', format: 'date' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Invoice updated successfully' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  @ApiResponse({
    status: 403,
    description:
      'Access denied - invoice not from your company or insufficient role',
  })
  async updateInvoice(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateInvoiceSchema))
    updateData: UpdateInvoiceData,
    @GetUser() currentUser: UserFromToken,
  ) {
    const updatedInvoice = await this.invoiceService.updateInvoice(
      id,
      updateData,
      currentUser.id,
      currentUser.companyId,
    );
    return {
      message: 'Invoice updated successfully',
      invoice: updatedInvoice,
    };
  }

  @Delete(':id')
  @Roles(Role.OWNER)
  @ApiOperation({
    summary: 'Delete invoice by ID (must be from same company, OWNER only)',
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Invoice deleted successfully' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  @ApiResponse({
    status: 403,
    description:
      'Access denied - invoice not from your company or OWNER role required',
  })
  async deleteInvoice(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() currentUser: UserFromToken,
  ) {
    return await this.invoiceService.deleteInvoice(id, currentUser.companyId);
  }
}
