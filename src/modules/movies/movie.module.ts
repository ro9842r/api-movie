import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [MoviesController],
  providers: [
    MoviesService,
    {
      provide: 'TMDB_API_KEY',
      useFactory: (configService: ConfigService) =>
        configService.getOrThrow<string>('TMBD_API_KEY'),
      inject: [ConfigService],
    },
  ],
  exports: [MoviesService],
})
export class MoviesModule {}
