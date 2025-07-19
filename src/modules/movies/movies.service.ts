import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse, AxiosError } from 'axios';
import {
  SearchMovieDto,
  SearchMovieResponseDto,
  GenresResponseDto,
} from './dto/search-movie.dto';

@Injectable()
export class MoviesService {
  private readonly baseUrl = 'https://api.themoviedb.org/3';
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
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

      const response: AxiosResponse<SearchMovieResponseDto> = await axios.get(
        `${this.baseUrl}/search/movie`,
        { params },
      );

      return response.data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        const status = axiosError.response?.status || HttpStatus.BAD_REQUEST;
        throw new HttpException('Error searching movies', status);
      }

      throw new HttpException(
        'Internal server error while searching movies',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getGenres(): Promise<GenresResponseDto> {
    try {
      const params = {
        api_key: this.apiKey,
      };

      const response: AxiosResponse<GenresResponseDto> = await axios.get(
        `${this.baseUrl}/genre/movie/list`,
        { params },
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        const status = axiosError.response?.status || HttpStatus.BAD_REQUEST;
        throw new HttpException('Error fetching genres', status);
      }

      throw new HttpException(
        'Internal server error while fetching genres',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
