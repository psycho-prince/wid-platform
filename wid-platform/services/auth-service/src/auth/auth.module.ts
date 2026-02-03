
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport'; // Import PassportModule
import { User } from '../user/user.entity';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy'; // Import LocalStrategy

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule, // Include PassportModule
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60s' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  providers: [AuthService, UserService, JwtStrategy, LocalStrategy], // Add LocalStrategy here
  controllers: [AuthController],
  exports: [AuthService, UserService, JwtModule],
})
export class AuthModule {}
