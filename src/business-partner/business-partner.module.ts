import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessPartnersController } from './business-partner.controller';
import { BusinessPartnersService } from './business-partner.service';
import { BusinessPartners } from './business-partner.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessPartners]), AuthModule],
  controllers: [BusinessPartnersController],
  providers: [BusinessPartnersService],
  exports: [BusinessPartnersService],
})
export class BusinessPartnersModule {}
