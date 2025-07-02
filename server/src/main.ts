import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { MongoMemoryServer } from 'mongodb-memory-server';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Enable CORS for development
  app.enableCors({
    origin: ['http://localhost:4321', 'http://localhost:4200'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  });

  // Serve static files from the public directory
  app.useStaticAssets(join(__dirname, '..', '..', 'public'), {
    prefix: '/public/',
  });
  
  // Serve the HTML file from root
  app.useStaticAssets(join(__dirname, '..', '..'), {
    index: false,
  });
  
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  // Use this URI in your MongooseModule.forRoot(uri)

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`NestJS server running on http://localhost:${port}`);
  console.log(`Static files served from /public/`);
}
bootstrap();