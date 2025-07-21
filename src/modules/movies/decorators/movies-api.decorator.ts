import { applyDecorators } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import {
  SearchMovieResponseDto,
  GenresResponseDto,
  MovieDetailsDto,
} from '../dto/search-movie.dto';
import { ErrorResponseDto } from '../../../auth/dto';

/**
 * Movies API documentation decorators
 */
export const MoviesApiTags = () => ApiTags('Movies');

export const SearchMoviesApiDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Search movies by name',
      description: 'Search for movies using a text query from TMDB API',
    }),
    ApiQuery({
      name: 'query',
      description: 'Movie title or keywords to search for',
      example: 'The Matrix',
    }),
    ApiResponse({
      status: 200,
      description: 'Movies found successfully',
      type: SearchMovieResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Invalid search query',
      type: ErrorResponseDto,
    }),
  );

export const GetGenresApiDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get all movie genres',
      description: 'Retrieve list of all available movie genres from TMDB',
    }),
    ApiResponse({
      status: 200,
      description: 'Genres retrieved successfully',
      type: GenresResponseDto,
    }),
  );

export const GetPopularMoviesApiDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get popular movies',
      description: 'Retrieve a paginated list of popular movies',
    }),
    ApiQuery({
      name: 'page',
      description: 'Page number for pagination',
      example: 1,
      required: false,
    }),
    ApiResponse({
      status: 200,
      description: 'Popular movies retrieved successfully',
      type: SearchMovieResponseDto,
    }),
  );

export const GetNowPlayingApiDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get now playing movies',
      description: 'Retrieve movies currently playing in theaters',
    }),
    ApiQuery({
      name: 'page',
      description: 'Page number for pagination',
      example: 1,
      required: false,
    }),
    ApiResponse({
      status: 200,
      description: 'Now playing movies retrieved successfully',
      type: SearchMovieResponseDto,
    }),
  );

export const DiscoverMoviesApiDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Discover movies with filters',
      description:
        'Find movies based on various criteria like year, genre, etc.',
    }),
    ApiQuery({
      name: 'page',
      description: 'Page number for pagination',
      example: 1,
      required: false,
    }),
    ApiQuery({
      name: 'year',
      description: 'Filter by release year',
      example: 2023,
      required: false,
    }),
    ApiQuery({
      name: 'with_genres',
      description: 'Filter by genre IDs (comma-separated)',
      example: '28,12',
      required: false,
    }),
    ApiResponse({
      status: 200,
      description: 'Movies discovered successfully',
      type: SearchMovieResponseDto,
    }),
  );

export const GetMovieByIdApiDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get movie details by ID',
      description: 'Retrieve detailed information about a specific movie',
    }),
    ApiParam({
      name: 'id',
      description: 'TMDB movie ID',
      example: 550,
    }),
    ApiResponse({
      status: 200,
      description: 'Movie details retrieved successfully',
      type: MovieDetailsDto,
    }),
    ApiNotFoundResponse({
      description: 'Movie not found',
      type: ErrorResponseDto,
    }),
  );
