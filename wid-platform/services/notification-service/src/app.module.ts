
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Potentially not needed if no entities
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HmacAuthMiddleware } from './common/middleware/hmac-auth.middleware';
import { NotificationModule } from './notification/notification.module'; // Import NotificationModule

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // TypeOrmModule.forRoot is not needed if this service does not use a database directly
    NotificationModule, // Include NotificationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HmacAuthMiddleware)
      .forRoutes('*');
  }
}
