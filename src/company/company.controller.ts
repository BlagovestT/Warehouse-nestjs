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

import { CompanyService } from './company.service';
import { CreateCompanyData, UpdateCompanyData } from './company.entity';
import { createCompanySchema, updateCompanySchema } from './company.schema';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from '../common/enums/role.enum';
import { UserFromToken } from '../common/guards/jwt.guard';

@ApiTags('Companies')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  @Roles(Role.VIEWER, Role.OPERATOR, Role.OWNER)
  @ApiOperation({ summary: 'Get all companies (filtered by user company)' })
  @ApiResponse({
    status: 200,
    description: 'List of companies retrieved successfully',
  })
  async getAllCompanies(@GetUser() currentUser: UserFromToken) {
    return await this.companyService.getAllCompanies(currentUser.companyId);
  }

  @Get(':id')
  @Roles(Role.VIEWER, Role.OPERATOR, Role.OWNER)
  @ApiOperation({ summary: "Get company by ID (must be user's company)" })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Company retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied - not your company',
  })
  async getCompanyById(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() currentUser: UserFromToken,
  ) {
    return await this.companyService.getCompanyById(id, currentUser.companyId);
  }

  @Post()
  @Roles(Role.OPERATOR, Role.OWNER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new company' })
  @ApiBody({
    description: 'Company creation data',
    schema: {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string', minLength: 1, maxLength: 255 },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Company created successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Company already exists',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied - OPERATOR or OWNER role required',
  })
  async createCompany(
    @Body(new ZodValidationPipe(createCompanySchema))
    companyData: CreateCompanyData,
    @GetUser() currentUser: UserFromToken,
  ) {
    const newCompany = await this.companyService.createCompany(
      companyData,
      currentUser.id,
    );
    return {
      message: 'Company created successfully',
      company: newCompany,
    };
  }

  @Put(':id')
  @Roles(Role.OPERATOR, Role.OWNER)
  @ApiOperation({ summary: "Update company (must be user's company)" })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiBody({
    description: 'Company update data',
    schema: {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string', minLength: 1, maxLength: 255 },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Company updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied - not your company or insufficient role',
  })
  async updateCompany(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateCompanySchema))
    updateData: UpdateCompanyData,
    @GetUser() currentUser: UserFromToken,
  ) {
    const updatedCompany = await this.companyService.updateCompany(
      id,
      updateData,
      currentUser.id,
      currentUser.companyId,
    );
    return {
      message: 'Company updated successfully',
      company: updatedCompany,
    };
  }

  @Delete(':id')
  @Roles(Role.OWNER)
  @ApiOperation({
    summary: "Delete company (must be user's company, OWNER only)",
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Company deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied - not your company or OWNER role required',
  })
  async deleteCompany(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() currentUser: UserFromToken,
  ) {
    return await this.companyService.deleteCompany(id, currentUser.companyId);
  }
}
