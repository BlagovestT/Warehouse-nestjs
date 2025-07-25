import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { EnvService } from './env/env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
  });

  const envService = app.get(EnvService);
  const port = envService.get('PORT');

  const config = new DocumentBuilder()
    .setTitle('Warehouse Management System API')
    .setVersion('1.0')
    .addTag('Authentication', 'User registration and login endpoints')
    .addTag('Users', 'User management operations')
    .addTag('Companies', 'Company management operations')
    .addTag('Business Partners', 'Customer and supplier management')
    .addTag('Warehouses', 'Warehouse management operations')
    .addTag('Products', 'Product catalog management')
    .addTag('Orders', 'Order processing and management')
    .addTag('Order Items', 'Order line item management')
    .addTag('Invoices', 'Invoice and billing management')
    .addTag('Reports', 'Analytics and reporting endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addServer(`http://localhost:${port}`, 'Development server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api-docs`);
}

bootstrap();
