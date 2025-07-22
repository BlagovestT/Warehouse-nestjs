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
import { UserService } from './user.service';
import { CreateUserData, UpdateUserData, User } from './user.entity';
import { createUserSchema, updateUserSchema } from './user.schema';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // GET /api/user - Get all users (Protected)
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  // GET /api/user/profile - Get current user profile (Protected)
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@GetUser() user: User) {
    return user;
  }

  // GET /api/user/:id - Get user by ID (Protected)
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.getUserById(id);
  }

  // POST /api/user - Create new user (Public for admin)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async createUser(@Body() userData: CreateUserData) {
    const newUser = await this.userService.createUser(userData);
    return {
      message: 'User created successfully',
      user: newUser,
    };
  }

  // PUT /api/user/:id - Update user (Protected)
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(updateUserSchema))
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: UpdateUserData,
  ) {
    const updatedUser = await this.userService.updateUser(id, updateData);
    return {
      message: 'User updated successfully',
      user: updatedUser,
    };
  }

  // DELETE /api/user/:id - Delete user (Protected)
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.deleteUser(id);
  }
}
