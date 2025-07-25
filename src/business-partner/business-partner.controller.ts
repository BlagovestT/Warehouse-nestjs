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

import { BusinessPartnersService } from './business-partner.service';
import {
  CreateBusinessPartnersData,
  UpdateBusinessPartnersData,
} from './business-partner.entity';
import {
  createBusinessPartnersSchema,
  updateBusinessPartnersSchema,
} from './business-partner.schema';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from '../common/enums/role.enum';
import { UserFromToken } from '../common/guards/jwt.guard';

@ApiTags('Business Partners')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('business-partners')
export class BusinessPartnersController {
  constructor(
    private readonly businessPartnersService: BusinessPartnersService,
  ) {}

  @Get()
  @Roles(Role.VIEWER, Role.OPERATOR, Role.OWNER)
  @ApiOperation({
    summary: "Get all business partners from current user's company",
  })
  @ApiResponse({
    status: 200,
    description:
      'List of business partners from your company retrieved successfully',
  })
  async getAllBusinessPartners(@GetUser() currentUser: UserFromToken) {
    return await this.businessPartnersService.getAllBusinessPartners(
      currentUser.companyId,
    );
  }

  @Get('top-customer')
  @Roles(Role.VIEWER, Role.OPERATOR, Role.OWNER)
  @ApiTags('Reports')
  @ApiOperation({
    summary: "Get customer with most orders from current user's company",
  })
  @ApiResponse({
    status: 200,
    description: 'Top customer from your company retrieved successfully',
  })
  async getCustomerWithMostOrders(@GetUser() currentUser: UserFromToken) {
    return await this.businessPartnersService.getCustomerWithMostOrders(
      currentUser.companyId,
    );
  }

  @Get(':id')
  @Roles(Role.VIEWER, Role.OPERATOR, Role.OWNER)
  @ApiOperation({
    summary: 'Get business partner by ID (must be from same company)',
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Business partner retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Business partner not found' })
  @ApiResponse({
    status: 403,
    description: 'Access denied - business partner not from your company',
  })
  async getBusinessPartnerById(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() currentUser: UserFromToken,
  ) {
    return await this.businessPartnersService.getBusinessPartnerById(
      id,
      currentUser.companyId,
    );
  }

  @Post()
  @Roles(Role.OPERATOR, Role.OWNER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new business partner' })
  @ApiBody({
    description: 'Business partner creation data',
    schema: {
      type: 'object',
      required: ['name', 'type', 'companyId', 'email'],
      properties: {
        name: { type: 'string', minLength: 2, maxLength: 255 },
        type: { type: 'string', enum: ['customer', 'supplier'] },
        companyId: { type: 'string', format: 'uuid' },
        email: { type: 'string', format: 'email' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Business partner created successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Business partner already exists in your company',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied - OPERATOR or OWNER role required',
  })
  async createBusinessPartner(
    @Body(new ZodValidationPipe(createBusinessPartnersSchema))
    businessPartnerData: CreateBusinessPartnersData,
    @GetUser() currentUser: UserFromToken,
  ) {
    const newBusinessPartner =
      await this.businessPartnersService.createBusinessPartner(
        businessPartnerData,
        currentUser.id,
      );

    return {
      message: 'Business partner created successfully',
      businessPartner: newBusinessPartner,
    };
  }

  @Put(':id')
  @Roles(Role.OPERATOR, Role.OWNER)
  @ApiOperation({
    summary: 'Update a business partner (must be from same company)',
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiBody({
    description: 'Business partner update data',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', minLength: 2, maxLength: 255 },
        email: { type: 'string', format: 'email' },
        type: { type: 'string', enum: ['customer', 'supplier'] },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Business partner updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Business partner not found' })
  @ApiResponse({
    status: 403,
    description:
      'Access denied - business partner not from your company or insufficient role',
  })
  async updateBusinessPartner(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateBusinessPartnersSchema))
    updateData: UpdateBusinessPartnersData,
    @GetUser() currentUser: UserFromToken,
  ) {
    const updatedBusinessPartner =
      await this.businessPartnersService.updateBusinessPartner(
        id,
        updateData,
        currentUser.id,
        currentUser.companyId,
      );

    return {
      message: 'Business partner updated successfully',
      businessPartner: updatedBusinessPartner,
    };
  }

  @Delete(':id')
  @Roles(Role.OWNER)
  @ApiOperation({
    summary:
      'Delete a business partner (must be from same company, OWNER only)',
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Business partner deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Business partner not found' })
  @ApiResponse({
    status: 403,
    description:
      'Access denied - business partner not from your company or OWNER role required',
  })
  async deleteBusinessPartner(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() currentUser: UserFromToken,
  ) {
    return await this.businessPartnersService.deleteBusinessPartner(
      id,
      currentUser.companyId,
    );
  }
}
