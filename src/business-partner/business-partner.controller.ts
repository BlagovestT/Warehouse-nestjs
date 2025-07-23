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

@Controller('business-partners')
export class BusinessPartnersController {
  constructor(
    private readonly businessPartnersService: BusinessPartnersService,
  ) {}

  // GET /api/business-partners - Get all business partners
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllBusinessPartners() {
    return await this.businessPartnersService.getAllBusinessPartners();
  }

  // GET /api/business-partners/:id - Get business partner by ID
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getBusinessPartnerById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.businessPartnersService.getBusinessPartnerById(id);
  }

  // POST /api/business-partners - Create new business partner
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(createBusinessPartnersSchema))
  async createBusinessPartner(
    @Body() businessPartnerData: CreateBusinessPartnersData,
  ) {
    const newBusinessPartner =
      await this.businessPartnersService.createBusinessPartner(
        businessPartnerData,
      );

    return {
      message: 'Business partner created successfully',
      businessPartner: newBusinessPartner,
    };
  }

  // PUT /api/business-partners/:id - Update business partner
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(updateBusinessPartnersSchema))
  async updateBusinessPartner(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: UpdateBusinessPartnersData,
  ) {
    const updatedBusinessPartner =
      await this.businessPartnersService.updateBusinessPartner(id, updateData);

    return {
      message: 'Business partner updated successfully',
      businessPartner: updatedBusinessPartner,
    };
  }

  // DELETE /api/business-partners/:id - Delete business partner
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteBusinessPartner(@Param('id', ParseUUIDPipe) id: string) {
    return await this.businessPartnersService.deleteBusinessPartner(id);
  }
}
