import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { MongoMemoryServer } from 'mongodb-memory-server';
import rateLimit from 'express-rate-limit';

// Security headers middleware
function setSecurityHeaders(req: any, res: any, next: any) {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self'; font-src 'self' https://fonts.gstatic.com; frame-ancestors 'self';");
  next();
}

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

  // Add security headers
  app.use(setSecurityHeaders);

  // Add rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/', limiter);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`NestJS server running on http://localhost:${port}`);
  console.log(`Static files served from /public/`);
}
bootstrap();