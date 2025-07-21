import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { VALIDATION_PIPE_OPTIONS } from './config/validation-pipe.config';
import { CORS_CONFIG } from './config/cors.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api/v1';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS));
  app.enableCors(CORS_CONFIG);

  const config = new DocumentBuilder()
    .setTitle('Api Movie')
    .setDescription(
      'API Movie is a comprehensive movie management system that allows users to search for movies, create personalized movie lists, and manage their movie collections. Built with modern technologies and following best practices for scalable and maintainable code.',
    )
    .setVersion('1.0')
    .addTag('ApiMovie')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Enter JWT token',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
