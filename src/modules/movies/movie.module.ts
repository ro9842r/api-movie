import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule, HttpService } from '@nestjs/axios';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { TmdbApiKeyInterceptor } from './interceptors/tmdb-api-key.interceptor';

@Module({
  imports: [
    ConfigModule,
    HttpModule.register({
      baseURL: 'https://api.themoviedb.org/3',
    }),
  ],
  controllers: [MoviesController],
  providers: [
    MoviesService,
    TmdbApiKeyInterceptor,
    {
      provide: 'TMDB_API_KEY',
      useFactory: (configService: ConfigService) =>
        configService.getOrThrow<string>('TMBD_API_KEY'),
      inject: [ConfigService],
    },
    {
      provide: 'TMDB_HTTP_SERVICE',
      useFactory: (
        httpService: HttpService,
        interceptor: TmdbApiKeyInterceptor,
      ) => {
        httpService.axiosRef.interceptors.request.use(interceptor.addApiKey);
        return httpService;
      },
      inject: [HttpService, TmdbApiKeyInterceptor],
    },
  ],
  exports: [MoviesService],
})
export class MoviesModule {}
