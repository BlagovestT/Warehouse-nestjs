import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Company,
  CreateCompanyData,
  UpdateCompanyData,
} from './company.entity';
import { BaseService } from '../common/services/base.service';

@Injectable()
export class CompanyService extends BaseService<Company> {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {
    super(companyRepository);
  }

  protected getEntityName(): string {
    return 'Company';
  }

  async getAllCompanies(): Promise<Company[]> {
    return this.getAll();
  }

  async getCompanyById(id: string): Promise<Company> {
    return this.getById(id);
  }

  async deleteCompany(id: string): Promise<{ message: string }> {
    return this.deleteById(id);
  }

  async createCompany(companyData: CreateCompanyData): Promise<Company> {
    const { name, modifiedBy } = companyData;

    const existingCompany = await this.companyRepository.findOne({
      where: { name },
    });

    if (existingCompany) {
      throw new ConflictException('Company already exists');
    }

    const company = this.companyRepository.create({
      name,
      modifiedBy,
    });

    return await this.companyRepository.save(company);
  }

  async updateCompany(
    id: string,
    updateData: UpdateCompanyData,
  ): Promise<Company> {
    const { name } = updateData;
    const company = await this.getById(id);

    // Check if name already exists (if name is being changed)
    if (name !== company.name) {
      const existingCompany = await this.companyRepository.findOne({
        where: { name },
      });

      if (existingCompany) {
        throw new ConflictException('Company name already exists');
      }
    }

    await this.companyRepository.update(id, { name });
    return await this.getById(id);
  }
}
