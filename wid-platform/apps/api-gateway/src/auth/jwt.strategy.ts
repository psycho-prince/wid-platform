
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-api-gateway') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // This payload is the decoded JWT.
    // We can add more validation here if needed, e.g., check if user exists in a user cache
    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException('Invalid JWT payload');
    }
    return { userId: payload.sub, email: payload.email }; // This object is attached to req.user
  }
}
