import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs'; // Using bcryptjs
import { UserService } from './user.service';
import { AuthResponse } from '@wid-platform/contracts';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, passwordPlain: string): Promise<AuthResponse> {
    const hashedPassword = await bcrypt.hash(passwordPlain, 10);
    const user = await this.userService.createUser(email, hashedPassword);
    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, passwordPlain: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (user && (await bcrypt.compare(passwordPlain, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any): Promise<AuthResponse> {
    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}