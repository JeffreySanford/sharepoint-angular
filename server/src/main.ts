import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Serve static files from the public directory
  app.useStaticAssets(join(__dirname, '..', '..', 'public'), {
    prefix: '/public/',
  });
  
  // Serve the HTML file from root
  app.useStaticAssets(join(__dirname, '..', '..'), {
    index: false,
  });
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`NestJS server running on http://localhost:${port}`);
  console.log(`Static files served from /public/`);
}
bootstrap();