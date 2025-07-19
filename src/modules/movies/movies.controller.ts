import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { MoviesService } from './movies.service';
import {
  SearchMovieDto,
  SearchMovieResponseDto,
  GenresResponseDto,
} from './dto/search-movie.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('search')
  async searchMoviesByName(
    @Query() searchParams: SearchMovieDto,
  ): Promise<SearchMovieResponseDto> {
    if (!searchParams.query) {
      throw new BadRequestException('Query parameter is required');
    }

    return await this.moviesService.searchMoviesByName(searchParams);
  }

  @Get('genres')
  async getGenres(): Promise<GenresResponseDto> {
    return await this.moviesService.getGenres();
  }
}
