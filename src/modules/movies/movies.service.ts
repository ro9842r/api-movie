import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
  private readonly apiKey: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiKey = this.configService.get<string>('TMBD_API_KEY') || '';
    if (!this.apiKey) {
      throw new Error('TMDB API key is not configured');
    }
  }

  async searchMoviesByName(
    searchParams: SearchMovieDto,
  ): Promise<SearchMovieResponseDto> {
    try {
      const {
        query,
        page = 1,
        include_adult = false,
        region,
        year,
        primary_release_year,
      } = searchParams;

      if (!query || query.trim().length === 0) {
        throw new HttpException(
          'Search query is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      const params = {
        api_key: this.apiKey,
        query: query.trim(),
        page,
        include_adult,
        ...(region && { region }),
        ...(year && { year }),
        ...(primary_release_year && { primary_release_year }),
      };

      const response = await firstValueFrom(
        this.httpService
          .get<SearchMovieResponseDto>(`${this.baseUrl}/search/movie`, {
            params,
          })
          .pipe(
            catchError((error: AxiosError) => {
              const status = error.response?.status || HttpStatus.BAD_REQUEST;
              throw new HttpException('Error searching movies', status);
            }),
          ),
      );

      return response.data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Internal server error while searching movies',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
