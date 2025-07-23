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
  UpdateMovieListDto,
  RemoveMovieFromListDto,
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

    const paginatedResult = await paginate<MovieList>(queryBuilder, options);

    const enrichedItems = await Promise.allSettled(
      paginatedResult.items.map(async (movieList) =>
        this.enrichMovieListWithDetails(movieList),
      ),
    );

    const successfulItems = enrichedItems
      .filter(
        (result): result is PromiseFulfilledResult<MovieList> =>
          result.status === 'fulfilled',
      )
      .map((result) => result.value);

    return {
      ...paginatedResult,
      items: successfulItems,
    };
  }
  private async enrichMovieListWithDetails(
    movieList: MovieList,
  ): Promise<MovieList> {
    if (!movieList.movies?.length) {
      return movieList;
    }

    const movieIds = movieList.movies.map((movie) => movie.movieId);

    const movieDetailsResults = await Promise.allSettled(
      movieIds.map((movieId) => this.moviesService.getMovieById(movieId)),
    );

    const moviesWithDetails = movieList.movies.map((movieItem, index) => {
      const movieDetailResult = movieDetailsResults[index];

      if (movieDetailResult.status === 'fulfilled') {
        return {
          ...movieItem,
          movieDetails: movieDetailResult.value,
        };
      } else {
        return {
          ...movieItem,
          movieDetails: null,
        };
      }
    });

    return {
      ...movieList,
      movies: moviesWithDetails,
    };
  }
  async getMoviesByListId(listId: string): Promise<MovieList> {
    const movieList = await this.movieListRepository.findOne({
      where: {
        id: listId,
        userId: this.userContext.currentUserId,
      },
    });

    if (!movieList) {
      throw new HttpException('Movie list not found', HttpStatus.NOT_FOUND);
    }

    return this.enrichMovieListWithDetails(movieList);
  }
  async deleteList(listId: string): Promise<void> {
    const movieList = await this.movieListRepository.findOne({
      where: {
        id: listId,
        userId: this.userContext.currentUserId,
      },
    });

    if (!movieList) {
      throw new HttpException('Movie list not found', HttpStatus.NOT_FOUND);
    }

    await this.movieListRepository.remove(movieList);
  }
  async updateList(
    listId: string,
    updateListDto: UpdateMovieListDto,
  ): Promise<MovieListDto> {
    const movieList = await this.movieListRepository.findOne({
      where: {
        id: listId,
        userId: this.userContext.currentUserId,
      },
    });

    if (!movieList) {
      throw new HttpException('Movie list not found', HttpStatus.NOT_FOUND);
    }

    if (updateListDto.name) {
      movieList.name = updateListDto.name;
    }

    if (updateListDto.description !== undefined) {
      movieList.description = updateListDto.description;
    }

    const updatedList = await this.movieListRepository.save(movieList);

    return updatedList;
  }

  async removeMovieFromList({
    listId,
    movieId,
  }: RemoveMovieFromListDto): Promise<MovieListDto> {
    const movieList = await this.movieListRepository.findOne({
      where: {
        id: listId,
        userId: this.userContext.currentUserId,
      },
    });

    if (!movieList) {
      throw new HttpException('Movie list not found', HttpStatus.NOT_FOUND);
    }

    const movieIndex = movieList.movies.findIndex(
      (movie) => movie.movieId === movieId,
    );

    if (movieIndex === -1) {
      throw new HttpException(
        'Movie not found in this list',
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedMovies = movieList.movies.filter(
      (movie) => movie.movieId !== movieId,
    );

    movieList.movies = updatedMovies;

    const updatedList = await this.movieListRepository.save(movieList);

    return updatedList;
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

    /**
     * const movieDetails = await this.moviesService.getMovieById(movieId);

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

     * / */
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
