import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginData, CreateUserData } from '../user/user.entity';
import { loginSchema, createUserSchema } from '../user/user.schema';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(@Body() loginData: LoginData) {
    return await this.authService.login(loginData);
  }

  @Post('register')
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async register(@Body() userData: CreateUserData) {
    return await this.authService.register(userData);
  }
}
