import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { MoviesService } from '@modules/movies/movies.service';
import { CreateMovieListDto, MovieListDto } from './dto/movie-list.dto';
import { MovieList } from './entities/movie-list.entity';
import { UserContext } from '../../auth/context/user.context';

@Injectable()
export class MovieListsService {
  constructor(
    @InjectRepository(MovieList)
    private readonly movieListRepository: Repository<MovieList>,
    private readonly moviesService: MoviesService,
    private readonly userContext: UserContext,
  ) {}

  async createList(createListDto: CreateMovieListDto): Promise<MovieListDto> {
    await this.moviesService.getGenreById(createListDto.genreId);

    const newList = this.movieListRepository.create({
      ...createListDto,
      userId: this.userContext.currentUserId,
      movies: [],
    });

    return this.movieListRepository.save(newList);
  }

  async getUserLists(
    options: IPaginationOptions,
  ): Promise<Pagination<MovieList>> {
    const queryBuilder =
      this.movieListRepository.createQueryBuilder('movieList');

    queryBuilder
      .where('movieList.userId = :userId', {
        userId: this.userContext.currentUserId,
      })
      .orderBy('movieList.createdAt', 'DESC');

    return paginate<MovieList>(queryBuilder, options);
  }
}
