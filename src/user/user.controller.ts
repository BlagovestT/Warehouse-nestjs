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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserData, UpdateUserData } from './user.entity';
import { createUserSchema, updateUserSchema } from './user.schema';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // GET /api/user - Get all users
  @Get()
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  // GET /api/user/:id - Get user by ID
  @Get(':id')
  async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.getUserById(id);
  }

  // POST /api/user - Create new user
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

  // PUT /api/user/:id - Update user
  @Put(':id')
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

  // DELETE /api/user/:id - Delete user
  @Delete(':id')
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.deleteUser(id);
  }
}
