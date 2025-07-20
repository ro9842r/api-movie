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
  private readonly baseUrl = 'https://api.themoviedb.org/3';

  constructor(
    @Inject('TMDB_API_KEY') private readonly apiKey: string,
    private readonly httpService: HttpService,
  ) {}

  async searchMoviesByName({
    query,
  }: SearchMovieDto): Promise<SearchMovieResponseDto> {
    const params = {
      api_key: this.apiKey,
      query,
    };

    return firstValueFrom(
      this.httpService
        .get<SearchMovieResponseDto>(`${this.baseUrl}/search/movie`, {
          params,
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
      this.httpService
        .get<GenresResponseDto>(`${this.baseUrl}/genre/movie/list`, {
          params: { api_key: this.apiKey },
        })
        .pipe(
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
