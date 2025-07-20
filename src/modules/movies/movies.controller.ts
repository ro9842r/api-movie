import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import {
  SearchMovieDto,
  SearchMovieResponseDto,
  GenresResponseDto,
  DiscoverMoviesDto,
} from './dto/search-movie.dto';

@Controller('movies')
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
}
