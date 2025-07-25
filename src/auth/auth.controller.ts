import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RoleGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from '../common/enums/role.enum';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserFromToken } from '../common/guards/jwt.guard';
import { LoginData, CreateUserData } from '../user/user.entity';
import {
  loginSchema,
  registerUserSchema,
  registerOwnerSchema,
} from '../user/user.schema';
import { RegisterOwnerData } from 'src/common/interfaces/auth.interface';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiBody({
    description: 'Login credentials',
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'JWT token returned on successful login',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body(new ZodValidationPipe(loginSchema)) loginData: LoginData) {
    return await this.authService.login(loginData);
  }

  @Post('register')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.OWNER)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register user in current company (OWNER only)' })
  @ApiBody({
    description: 'User registration payload',
    schema: {
      type: 'object',
      required: ['username', 'email', 'password', 'role'],
      properties: {
        username: { type: 'string', minLength: 3, maxLength: 50 },
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 6 },
        role: { type: 'string', enum: ['owner', 'operator', 'viewer'] },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  @ApiResponse({
    status: 403,
    description: 'Access denied - OWNER role required',
  })
  async register(
    @Body(new ZodValidationPipe(registerUserSchema))
    userData: Omit<CreateUserData, 'companyId'>,
    @GetUser() currentUser: UserFromToken,
  ) {
    const completeUserData: CreateUserData = {
      ...userData,
      companyId: currentUser.companyId,
    };

    const result = await this.authService.register(completeUserData);

    return {
      ...result,
      message: 'User registered successfully',
    };
  }

  @Post('register-owner')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register new company with owner user' })
  @ApiBody({
    description: 'Company and owner registration payload',
    schema: {
      type: 'object',
      required: ['companyName', 'username', 'email', 'password'],
      properties: {
        companyName: { type: 'string', minLength: 1, maxLength: 255 },
        username: { type: 'string', minLength: 3, maxLength: 50 },
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 6 },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Company and owner user created successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        company: { type: 'object' },
        user: { type: 'object' },
      },
    },
  })
  @ApiResponse({ status: 409, description: 'Company or email already exists' })
  async registerOwner(
    @Body(new ZodValidationPipe(registerOwnerSchema))
    ownerData: RegisterOwnerData,
  ) {
    return await this.authService.registerOwner(ownerData);
  }
}
