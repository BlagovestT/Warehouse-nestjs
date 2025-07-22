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
import { CompanyService } from './company.service';
import { CreateCompanyData, UpdateCompanyData } from './company.entity';
import { createCompanySchema, updateCompanySchema } from './company.schema';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../common/guards/jwt.guard';

@Controller('company')
@UseGuards(JwtAuthGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  // GET /api/company - Get all companies
  @Get()
  async getAllCompanies() {
    return await this.companyService.getAllCompanies();
  }

  // GET /api/company/:id - Get company by ID
  @Get(':id')
  async getCompanyById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.companyService.getCompanyById(id);
  }

  // POST /api/company - Create new company
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createCompanySchema))
  async createCompany(@Body() companyData: CreateCompanyData) {
    const newCompany = await this.companyService.createCompany(companyData);
    return {
      message: 'Company created successfully',
      company: newCompany,
    };
  }

  // PUT /api/company/:id - Update company
  @Put(':id')
  @UsePipes(new ZodValidationPipe(updateCompanySchema))
  async updateCompany(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: UpdateCompanyData,
  ) {
    const updatedCompany = await this.companyService.updateCompany(
      id,
      updateData,
    );
    return {
      message: 'Company updated successfully',
      company: updatedCompany,
    };
  }

  // DELETE /api/company/:id - Delete company
  @Delete(':id')
  async deleteCompany(@Param('id', ParseUUIDPipe) id: string) {
    return await this.companyService.deleteCompany(id);
  }
}
