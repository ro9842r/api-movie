import { applyDecorators } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  CreateMovieListDto,
  MovieListDto,
  AddMovieToListDto,
  UpdateMovieListDto,
  RemoveMovieFromListDto,
} from '../dto/movie-list.dto';
import { ErrorResponseDto } from '../../../auth/dto';
import { MovieList } from '../entities/movie-list.entity';

/**
 * Movie Lists API documentation decorators
 */
export const MovieListsApiTags = () =>
  applyDecorators(ApiTags('Movie Lists'), ApiBearerAuth());

export const CreateListApiDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Create a new movie list',
      description:
        'Create a personalized movie list for the authenticated user',
    }),
    ApiBody({ type: CreateMovieListDto }),
    ApiCreatedResponse({
      description: 'Movie list created successfully',
      type: MovieListDto,
    }),
    ApiBadRequestResponse({
      description: 'Invalid input data',
      type: ErrorResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Authentication required',
      type: ErrorResponseDto,
    }),
  );

export const GetMyListsApiDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get user movie lists',
      description:
        'Retrieve paginated list of movie lists for authenticated user',
    }),
    ApiQuery({
      name: 'page',
      description: 'Page number for pagination',
      example: 1,
      required: false,
    }),
    ApiQuery({
      name: 'limit',
      description: 'Number of items per page (max 100)',
      example: 10,
      required: false,
    }),
    ApiResponse({
      status: 200,
      description: 'Movie lists retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/MovieList' },
          },
          meta: {
            type: 'object',
            properties: {
              totalItems: { type: 'number', example: 25 },
              itemCount: { type: 'number', example: 10 },
              itemsPerPage: { type: 'number', example: 10 },
              totalPages: { type: 'number', example: 3 },
              currentPage: { type: 'number', example: 1 },
            },
          },
        },
      },
    }),
  );

export const AddMovieToListApiDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Add movie to list',
      description: 'Add a movie to an existing movie list',
    }),
    ApiBody({ type: AddMovieToListDto }),
    ApiResponse({
      status: 200,
      description: 'Movie added to list successfully',
      type: MovieListDto,
    }),
    ApiBadRequestResponse({
      description: 'Invalid list ID or movie ID',
      type: ErrorResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'Movie list not found',
      type: ErrorResponseDto,
    }),
  );

export const GetMoviesByListIdApiDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get movies from list',
      description: 'Retrieve all movies from a specific movie list',
    }),
    ApiParam({
      name: 'id',
      description: 'Movie list UUID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
      status: 200,
      description: 'Movies from list retrieved successfully',
      type: MovieList,
    }),
    ApiNotFoundResponse({
      description: 'Movie list not found',
      type: ErrorResponseDto,
    }),
  );

export const DeleteListApiDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Delete movie list',
      description: 'Permanently delete a movie list and all its movies',
    }),
    ApiParam({
      name: 'id',
      description: 'Movie list UUID to delete',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiNoContentResponse({
      description: 'Movie list deleted successfully',
    }),
    ApiNotFoundResponse({
      description: 'Movie list not found',
      type: ErrorResponseDto,
    }),
  );

export const UpdateListApiDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Update movie list',
      description: 'Update movie list name and description',
    }),
    ApiParam({
      name: 'id',
      description: 'Movie list UUID to update',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiBody({ type: UpdateMovieListDto }),
    ApiResponse({
      status: 200,
      description: 'Movie list updated successfully',
      type: MovieListDto,
    }),
    ApiBadRequestResponse({
      description: 'Invalid input data',
      type: ErrorResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'Movie list not found',
      type: ErrorResponseDto,
    }),
  );

export const RemoveMovieFromListApiDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Remove movie from list',
      description: 'Remove a specific movie from a movie list',
    }),
    ApiBody({ type: RemoveMovieFromListDto }),
    ApiResponse({
      status: 200,
      description: 'Movie removed from list successfully',
      type: MovieListDto,
    }),
    ApiBadRequestResponse({
      description: 'Invalid list ID or movie ID',
      type: ErrorResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'Movie list or movie not found',
      type: ErrorResponseDto,
    }),
  );
