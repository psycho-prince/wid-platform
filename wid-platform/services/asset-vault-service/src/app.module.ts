
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Asset } from './asset-vault/asset.entity'; // Import Asset
import { HmacAuthMiddleware } from './common/middleware/hmac-auth.middleware';
import { AssetVaultModule } from './asset-vault/asset-vault.module'; // Import AssetVaultModule

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Asset], // Register Asset entity
      synchronize: true, // For MVP, but use migrations in production
    }),
    AssetVaultModule, // Include AssetVaultModule
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
