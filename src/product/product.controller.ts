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
import { ProductService } from './product.service';
import { CreateProductData, UpdateProductData } from './product.entity';
import { createProductSchema, updateProductSchema } from './product.schema';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../common/guards/jwt.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // GET /api/product - Get all products (Protected)
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllProducts() {
    return await this.productService.getAllProducts();
  }

  // GET /api/product/:id - Get product by ID (Protected)
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getProductById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.productService.getProductById(id);
  }

  // POST /api/product - Create new product (Protected)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(createProductSchema))
  async createProduct(@Body() productData: CreateProductData) {
    const newProduct = await this.productService.createProduct(productData);

    return {
      message: 'Product created successfully',
      product: newProduct,
    };
  }

  // PUT /api/product/:id - Update product (Protected)
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(updateProductSchema))
  async updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: UpdateProductData,
  ) {
    const updatedProduct = await this.productService.updateProduct(
      id,
      updateData,
    );

    return {
      message: 'Product updated successfully',
      product: updatedProduct,
    };
  }

  // DELETE /api/product/:id - Delete product (Protected)
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteProduct(@Param('id', ParseUUIDPipe) id: string) {
    return await this.productService.deleteProduct(id);
  }
}
