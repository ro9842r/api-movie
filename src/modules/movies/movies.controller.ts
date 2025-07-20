import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  Param,
  UseInterceptors,
  UseFilters,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import {
  SearchMovieDto,
  SearchMovieResponseDto,
  GenresResponseDto,
  DiscoverMoviesDto,
  MovieDetailsDto,
} from './dto/search-movie.dto';
import { TransformInterceptor } from '../../shared/interceptors/transform.interceptor';
import { DatabaseExceptionFilter } from '../../shared/filters/database-exception.filter';

@Controller('movies')
@UseInterceptors(TransformInterceptor)
@UseFilters(DatabaseExceptionFilter)
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('search')
  async searchMoviesByName(
    @Query() searchParams: SearchMovieDto,
  ): Promise<SearchMovieResponseDto> {
    return await this.moviesService.searchMoviesByName(searchParams);
  }

  @Get('genres')
  async getGenres(): Promise<GenresResponseDto> {
    return await this.moviesService.getGenres();
  }

  @Get('popular')
  async getPopularMovies(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ): Promise<SearchMovieResponseDto> {
    return await this.moviesService.getPopularMovies(page);
  }

  @Get('now-playing')
  async getNowPlayingMovies(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ): Promise<SearchMovieResponseDto> {
    return await this.moviesService.getNowPlayingMovies(page);
  }

  @Get('discover')
  async discoverMovies(
    @Query() discoverParams: DiscoverMoviesDto,
  ): Promise<SearchMovieResponseDto> {
    return await this.moviesService.discoverMovies(discoverParams);
  }

  @Get(':id')
  async getMovieById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MovieDetailsDto> {
    return await this.moviesService.getMovieById(id);
  }
}
