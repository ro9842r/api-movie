import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { HttpModule } from '@nestjs/axios';
import { MoviesModule } from './modules/movies/movie.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    HttpModule,
    DatabaseModule,
    MoviesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
