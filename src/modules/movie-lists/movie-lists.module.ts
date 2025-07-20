import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieListsController } from './movie-lists.controller';
import { MovieListsService } from './movie-lists.service';
import { MoviesModule } from '@modules/movies/movie.module';
import { MovieList } from './entities/movie-list.entity';
import { UserContext } from '../../auth/context/user.context';

@Module({
  imports: [MoviesModule, TypeOrmModule.forFeature([MovieList])],
  controllers: [MovieListsController],
  providers: [MovieListsService, UserContext],
  exports: [MovieListsService],
})
export class MovieListsModule {}
