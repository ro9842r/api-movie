import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { MoviesService } from '@modules/movies/movies.service';
import {
  CreateMovieListDto,
  MovieListDto,
  AddMovieToListDto,
} from './dto/movie-list.dto';
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

  async addMovieToList({
    listId,
    movieId,
  }: AddMovieToListDto): Promise<MovieListDto> {
    const movieList = await this.movieListRepository.findOne({
      where: {
        id: listId,
        userId: this.userContext.currentUserId,
      },
    });

    if (!movieList) {
      throw new HttpException('Movie list not found', HttpStatus.NOT_FOUND);
    }

    const movieDetails = await this.moviesService.getMovieById(movieId);

    const hasMatchingGenre = movieDetails.genres.some(
      (genre) => genre.id === movieList.genreId,
    );

    if (!hasMatchingGenre) {
      throw new HttpException(
        `Movie does not belong to the genre "${movieList.genreName}"`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const movieAlreadyInList = movieList.movies.some(
      (movie) => movie.movieId === movieId,
    );

    if (movieAlreadyInList) {
      throw new HttpException(
        'Movie is already in this list',
        HttpStatus.CONFLICT,
      );
    }

    const updatedMovies = [
      ...movieList.movies,
      {
        movieId: movieId,
        addedAt: new Date().toISOString(),
      },
    ];

    movieList.movies = updatedMovies;

    return this.movieListRepository.save(movieList);
  }
}
