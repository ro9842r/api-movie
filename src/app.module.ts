import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { HttpModule } from '@nestjs/axios';
import { MoviesModule } from './modules/movies/movie.module';
import { MovieListsModule } from './modules/movie-lists/movie-lists.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      expandVariables: true,
    }),
    HttpModule,
    DatabaseModule,
    AuthModule,
    MoviesModule,
    MovieListsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
