import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../user/user.entity';
import { Company } from '../company/company.entity';
import { BusinessPartners } from '../business-partner/business-partner.entity';
import { Warehouse } from '../warehouse/warehouse.entity';
import { Product } from '../product/product.entity';
import { Order } from '../order/order.entity';
import { OrderItem } from '../order-item/order-item.entity';
import { Invoice } from '../invoice/invoice.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'warehouse_nest',
  synchronize: false,
  logging: true,
  entities: [
    User,
    Company,
    BusinessPartners,
    Warehouse,
    Product,
    Order,
    OrderItem,
    Invoice,
  ],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
});
