import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom, map, throwError } from 'rxjs';
import {
  SearchMovieDto,
  SearchMovieResponseDto,
  GenresResponseDto,
  DiscoverMoviesDto,
  MovieDetailsDto,
} from './dto/search-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @Inject('TMDB_HTTP_SERVICE')
    private readonly httpService: HttpService,
  ) {}

  async searchMoviesByName({
    query,
  }: SearchMovieDto): Promise<SearchMovieResponseDto> {
    return firstValueFrom(
      this.httpService
        .get<SearchMovieResponseDto>('/search/movie', {
          params: { query },
        })
        .pipe(
          map((response) => response.data),
          catchError((error: AxiosError) => {
            const status = error.response?.status || HttpStatus.BAD_REQUEST;
            const message = 'Error searching movies';
            return throwError(() => new HttpException(message, status));
          }),
        ),
    );
  }

  async getGenres(): Promise<GenresResponseDto> {
    const { genres } = await firstValueFrom(
      this.httpService.get<GenresResponseDto>('/genre/movie/list').pipe(
        map((response) => response.data),
        catchError((error: AxiosError) => {
          const status = error.response?.status || HttpStatus.BAD_REQUEST;
          const message = 'Error fetching genres';
          return throwError(() => new HttpException(message, status));
        }),
      ),
    );

    return { genres };
  }

  async getPopularMovies(page: number = 1): Promise<SearchMovieResponseDto> {
    return firstValueFrom(
      this.httpService
        .get<SearchMovieResponseDto>('/movie/popular', {
          params: { page },
        })
        .pipe(
          map((response) => response.data),
          catchError((error: AxiosError) => {
            const status = error.response?.status || HttpStatus.BAD_REQUEST;
            const message = 'Error fetching popular movies';
            return throwError(() => new HttpException(message, status));
          }),
        ),
    );
  }

  async getNowPlayingMovies(page: number = 1): Promise<SearchMovieResponseDto> {
    return firstValueFrom(
      this.httpService
        .get<SearchMovieResponseDto>('/movie/now_playing', {
          params: { page },
        })
        .pipe(
          map((response) => response.data),
          catchError((error: AxiosError) => {
            const status = error.response?.status || HttpStatus.BAD_REQUEST;
            const message = 'Error fetching now playing movies';
            return throwError(() => new HttpException(message, status));
          }),
        ),
    );
  }

  async discoverMovies(
    dto: DiscoverMoviesDto,
  ): Promise<SearchMovieResponseDto> {
    const { page = 1, year, with_genres } = dto;

    const params: Record<string, string | number> = { page };

    if (year) {
      params.year = year;
    }

    if (with_genres) {
      params.with_genres = with_genres;
    }

    return firstValueFrom(
      this.httpService
        .get<SearchMovieResponseDto>('/discover/movie', {
          params,
        })
        .pipe(
          map((response) => response.data),
          catchError((error: AxiosError) => {
            const status = error.response?.status || HttpStatus.BAD_REQUEST;
            const message = 'Error discovering movies';
            return throwError(() => new HttpException(message, status));
          }),
        ),
    );
  }

  async getMovieById(id: number): Promise<MovieDetailsDto> {
    return firstValueFrom(
      this.httpService.get<MovieDetailsDto>(`/movie/${id}`).pipe(
        map((response) => response.data),
        catchError((error: AxiosError) => {
          const status = error.response?.status || HttpStatus.NOT_FOUND;
          const message = `Movie with ID ${id} not found`;
          return throwError(() => new HttpException(message, status));
        }),
      ),
    );
  }
}
