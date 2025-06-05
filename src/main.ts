// src/main.ts
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('api');

  // Enable CORS. Dynamic import avoids issues with module loading order (i.e. @fastify/cors must be imported at the very top).
  const cors = await import('@fastify/cors');

  // More secure CORS configuration
  const isDevelopment = process.env.RAILWAY_ENVIRONMENT_NAME !== 'production';
  const allowedOrigins: string[] = [];

  // Allow production URL only if explicitly set
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    allowedOrigins.push(process.env.RAILWAY_PUBLIC_DOMAIN);
  }

  // Only add localhost fallback in development
  if (isDevelopment && !process.env.FRONTEND_URL) {
    allowedOrigins.push('http://localhost:5173');
  }

  // Throw error if no origins configured in production
  if (!isDevelopment && allowedOrigins.length === 0) {
    throw new Error('No CORS origins configured for production environment');
  }

  await app.register(cors.default, {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true, // Allow cookies or auth headers if needed
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Cigar API')
    .setDescription('API for managing cigars, brands, and vitolas')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
}
bootstrap();
