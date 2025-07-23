import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessPartners,
  CreateBusinessPartnersData,
  UpdateBusinessPartnersData,
} from './business-partner.entity';
import { BaseService } from '../common/services/base.service';

@Injectable()
export class BusinessPartnersService extends BaseService<BusinessPartners> {
  constructor(
    @InjectRepository(BusinessPartners)
    private readonly businessPartnersRepository: Repository<BusinessPartners>,
  ) {
    super(businessPartnersRepository);
  }

  protected getEntityName(): string {
    return 'BusinessPartner';
  }

  // CRUD
  async getAllBusinessPartners(): Promise<BusinessPartners[]> {
    return this.getAll();
  }

  async getBusinessPartnerById(id: string): Promise<BusinessPartners> {
    return this.getById(id);
  }

  async createBusinessPartner(
    businessPartnerData: CreateBusinessPartnersData,
  ): Promise<BusinessPartners> {
    const { email } = businessPartnerData;

    const existingBusinessPartner =
      await this.businessPartnersRepository.findOne({
        where: { email },
      });

    if (existingBusinessPartner) {
      throw new ConflictException('Business partner already exists');
    }

    const businessPartner =
      this.businessPartnersRepository.create(businessPartnerData);
    return await this.businessPartnersRepository.save(businessPartner);
  }

  async updateBusinessPartner(
    id: string,
    updateData: UpdateBusinessPartnersData,
  ): Promise<BusinessPartners> {
    const businessPartner = await this.getBusinessPartnerById(id);

    if (updateData.email && updateData.email !== businessPartner.email) {
      const existingBusinessPartner =
        await this.businessPartnersRepository.findOne({
          where: { email: updateData.email },
        });

      if (existingBusinessPartner) {
        throw new ConflictException('Email already exists');
      }
    }

    await this.businessPartnersRepository.update(id, updateData);
    return await this.getBusinessPartnerById(id);
  }

  async deleteBusinessPartner(id: string): Promise<{ message: string }> {
    return this.deleteById(id);
  }
}
