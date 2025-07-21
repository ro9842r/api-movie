import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const CORS_CONFIG: CorsOptions = {
  origin: ['http://localhost:4200'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization', 'Content-Type'],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  credentials: true,
};
