
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { AuditClientService } from './audit-client/audit-client.service';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'; // Import ThrottlerModule and ThrottlerGuard
import { APP_GUARD } from '@nestjs/core'; // Import APP_GUARD

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 10, // 10 requests per minute
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy,
    AuditClientService,
    {
      provide: APP_GUARD, // Apply ThrottlerGuard globally
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
