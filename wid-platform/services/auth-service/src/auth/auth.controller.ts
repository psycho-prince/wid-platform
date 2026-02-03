import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  RegisterUserRequestSchema,
  LoginUserRequestSchema,
  AuthResponse,
} from '@wid-platform/contracts';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body(new ZodValidationPipe(RegisterUserRequestSchema))
    createUserDto: RegisterUserRequestSchema,
  ): Promise<AuthResponse> {
    const { email, password } = createUserDto;
    return this.authService.register(email, password);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @Body(new ZodValidationPipe(LoginUserRequestSchema))
    loginUserDto: LoginUserRequestSchema,
    @Request() req,
  ): Promise<AuthResponse> {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}