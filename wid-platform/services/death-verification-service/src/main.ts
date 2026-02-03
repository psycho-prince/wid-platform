import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // All routes will be prefixed with /api
  const port = process.env.PORT || 3005;
  await app.listen(port, '0.0.0.0');
  console.log(`Death Verification Service listening on http://0.0.0.0:${port}/api`);
}
bootstrap();