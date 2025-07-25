import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { Company } from './company.entity';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { RoleGuard } from '../common/guards/role.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [CompanyController],
  providers: [CompanyService, JwtAuthGuard, RoleGuard],
  exports: [CompanyService],
})
export class CompanyModule {}
