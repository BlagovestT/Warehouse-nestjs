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
import { ProductService } from './product.service';
import { CreateProductData, UpdateProductData } from './product.entity';
import { createProductSchema, updateProductSchema } from './product.schema';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from '../common/enums/role.enum';
import { BestSellingProductResult } from 'src/common/interfaces/product.interface';
import { UserFromToken } from '../common/guards/jwt.guard';

@ApiTags('Products')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @Roles(Role.VIEWER, Role.OPERATOR, Role.OWNER)
  @ApiOperation({ summary: "Get all products from current user's company" })
  @ApiResponse({
    status: 200,
    description: 'List of products from your company retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          price: { type: 'number' },
          type: { type: 'string', enum: ['solid', 'liquid'] },
          companyId: { type: 'string', format: 'uuid' },
          modifiedBy: { type: 'string', format: 'uuid' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  async getAllProducts(@GetUser() currentUser: UserFromToken) {
    return await this.productService.getAllProducts(currentUser.companyId);
  }

  @Get('best-product')
  @Roles(Role.VIEWER, Role.OPERATOR, Role.OWNER)
  @ApiTags('Reports')
  @ApiOperation({
    summary: "Get best selling product from current user's company",
  })
  @ApiResponse({
    status: 200,
    description:
      'Best selling product from your company retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            productName: { type: 'string' },
            price: { type: 'string' },
            companyName: { type: 'string' },
            totalSold: { type: 'string' },
          },
        },
      },
    },
  })
  async getBestProduct(@GetUser() currentUser: UserFromToken): Promise<{
    message: string;
    data: BestSellingProductResult;
  }> {
    const bestProduct = await this.productService.getBestSellingProducts(
      currentUser.companyId,
    );
    return {
      message: 'Best selling product retrieved successfully',
      data: bestProduct,
    };
  }

  @Get(':id')
  @Roles(Role.VIEWER, Role.OPERATOR, Role.OWNER)
  @ApiOperation({ summary: 'Get product by ID (must be from same company)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied - product not from your company',
  })
  async getProductById(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() currentUser: UserFromToken,
  ) {
    return await this.productService.getProductById(id, currentUser.companyId);
  }

  @Post()
  @Roles(Role.OPERATOR, Role.OWNER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new product' })
  @ApiBody({
    description: 'Product creation data',
    schema: {
      type: 'object',
      required: ['companyId', 'name', 'price', 'type'],
      properties: {
        companyId: { type: 'string', format: 'uuid' },
        name: { type: 'string', minLength: 2, maxLength: 255 },
        price: { type: 'number', minimum: 0 },
        type: { type: 'string', enum: ['solid', 'liquid'] },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Product name already exists in your company',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied - OPERATOR or OWNER role required',
  })
  async createProduct(
    @Body(new ZodValidationPipe(createProductSchema))
    productData: CreateProductData,
    @GetUser() currentUser: UserFromToken,
  ) {
    const newProduct = await this.productService.createProduct(
      productData,
      currentUser.id,
    );

    return {
      message: 'Product created successfully',
      product: newProduct,
    };
  }

  @Put(':id')
  @Roles(Role.OPERATOR, Role.OWNER)
  @ApiOperation({ summary: 'Update product (must be from same company)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiBody({
    description: 'Product update data',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', minLength: 2, maxLength: 255 },
        price: { type: 'number', minimum: 0 },
        type: { type: 'string', enum: ['solid', 'liquid'] },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
  })
  @ApiResponse({
    status: 403,
    description:
      'Access denied - product not from your company or insufficient role',
  })
  async updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateProductSchema))
    updateData: UpdateProductData,
    @GetUser() currentUser: UserFromToken,
  ) {
    const updatedProduct = await this.productService.updateProduct(
      id,
      updateData,
      currentUser.id,
      currentUser.companyId,
    );

    return {
      message: 'Product updated successfully',
      product: updatedProduct,
    };
  }

  @Delete(':id')
  @Roles(Role.OWNER)
  @ApiOperation({
    summary: 'Delete product (must be from same company, OWNER only)',
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully',
  })
  @ApiResponse({
    status: 403,
    description:
      'Access denied - product not from your company or OWNER role required',
  })
  async deleteProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() currentUser: UserFromToken,
  ) {
    return await this.productService.deleteProduct(id, currentUser.companyId);
  }
}
