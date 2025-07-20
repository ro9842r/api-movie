import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom, map, throwError } from 'rxjs';
import {
  SearchMovieDto,
  SearchMovieResponseDto,
  GenresResponseDto,
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
}
