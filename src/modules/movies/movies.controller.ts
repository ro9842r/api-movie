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
import { TransformInterceptor } from '@shared/interceptors/transform.interceptor';
import { DatabaseExceptionFilter } from '@shared/filters/database-exception.filter';
import {
  MoviesApiTags,
  SearchMoviesApiDocs,
  GetGenresApiDocs,
  GetPopularMoviesApiDocs,
  GetNowPlayingApiDocs,
  DiscoverMoviesApiDocs,
  GetMovieByIdApiDocs,
} from './decorators';

@Controller('movies')
@UseInterceptors(TransformInterceptor)
@UseFilters(DatabaseExceptionFilter)
@MoviesApiTags()
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('search')
  @SearchMoviesApiDocs()
  async searchMoviesByName(
    @Query() searchParams: SearchMovieDto,
  ): Promise<SearchMovieResponseDto> {
    return await this.moviesService.searchMoviesByName(searchParams);
  }

  @Get('genres')
  @GetGenresApiDocs()
  async getGenres(): Promise<GenresResponseDto> {
    return await this.moviesService.getGenres();
  }

  @Get('popular')
  @GetPopularMoviesApiDocs()
  async getPopularMovies(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ): Promise<SearchMovieResponseDto> {
    return await this.moviesService.getPopularMovies(page);
  }

  @Get('now-playing')
  @GetNowPlayingApiDocs()
  async getNowPlayingMovies(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ): Promise<SearchMovieResponseDto> {
    return await this.moviesService.getNowPlayingMovies(page);
  }

  @Get('discover')
  @DiscoverMoviesApiDocs()
  async discoverMovies(
    @Query() discoverParams: DiscoverMoviesDto,
  ): Promise<SearchMovieResponseDto> {
    return await this.moviesService.discoverMovies(discoverParams);
  }

  @Get(':id')
  @GetMovieByIdApiDocs()
  async getMovieById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MovieDetailsDto> {
    return await this.moviesService.getMovieById(id);
  }
}
