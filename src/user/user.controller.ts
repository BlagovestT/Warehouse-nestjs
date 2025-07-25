import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
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
import { UserService } from './user.service';
import { UpdateUserData } from './user.entity';
import { updateUserSchema } from './user.schema';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from '../common/enums/role.enum';
import { UserFromToken } from '../common/guards/jwt.guard';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(Role.VIEWER, Role.OPERATOR, Role.OWNER)
  @ApiOperation({ summary: "Get all users from current user's company" })
  @ApiResponse({
    status: 200,
    description: 'List of users from your company retrieved successfully',
  })
  async getAllUsers(@GetUser() currentUser: UserFromToken) {
    return await this.userService.getAllUsers(currentUser.companyId);
  }

  @Get('profile')
  @Roles(Role.VIEWER, Role.OPERATOR, Role.OWNER)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  getProfile(@GetUser() user: UserFromToken) {
    return user;
  }

  @Get(':id')
  @Roles(Role.VIEWER, Role.OPERATOR, Role.OWNER)
  @ApiOperation({ summary: 'Get user by ID (must be from same company)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({
    status: 403,
    description: 'Access denied - user not from your company',
  })
  async getUserById(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() currentUser: UserFromToken,
  ) {
    return await this.userService.getUserById(id, currentUser.companyId);
  }

  @Put(':id')
  @Roles(Role.OPERATOR, Role.OWNER)
  @ApiOperation({ summary: 'Update user by ID (must be from same company)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiBody({
    description: 'User update payload',
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', minLength: 3, maxLength: 50 },
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 6 },
        role: { type: 'string', enum: ['owner', 'operator', 'viewer'] },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({
    status: 403,
    description:
      'Access denied - user not from your company or insufficient role',
  })
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateUserSchema)) updateData: UpdateUserData,
    @GetUser() currentUser: UserFromToken,
  ) {
    const updatedUser = await this.userService.updateUser(
      id,
      updateData,
      currentUser.id,
      currentUser.companyId,
    );
    return {
      message: 'User updated successfully',
      user: updatedUser,
    };
  }

  @Delete(':id')
  @Roles(Role.OWNER)
  @ApiOperation({
    summary: 'Delete user by ID (must be from same company, OWNER only)',
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({
    status: 403,
    description:
      'Access denied - user not from your company or OWNER role required',
  })
  async deleteUser(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() currentUser: UserFromToken,
  ) {
    return await this.userService.deleteUser(id, currentUser.companyId);
  }
}
