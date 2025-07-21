import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMovieListDto {
  @ApiProperty({
    description: 'Name of the movie list',
    example: 'My Favorite Action Movies',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Description of the movie list',
    example: 'A collection of my favorite action-packed movies',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Genre ID from TMDB',
    example: 28,
  })
  @Type(() => Number)
  @IsNumber()
  genreId: number;

  @ApiProperty({
    description: 'Genre name',
    example: 'Action',
  })
  @IsString()
  @IsNotEmpty()
  genreName: string;
}

export class AddMovieToListDto {
  @ApiProperty({
    description: 'UUID of the movie list',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  listId: string;

  @ApiProperty({
    description: 'TMDB movie ID',
    example: 550,
  })
  @Type(() => Number)
  @IsNumber()
  movieId: number;
}

export class UpdateMovieListDto {
  @ApiProperty({
    description: 'Updated name of the movie list',
    example: 'My Updated Movie List',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Updated description of the movie list',
    example: 'An updated description for my movie list',
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class RemoveMovieFromListDto {
  @ApiProperty({
    description: 'UUID of the movie list',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  listId: string;

  @ApiProperty({
    description: 'TMDB movie ID to remove',
    example: 550,
  })
  @Type(() => Number)
  @IsNumber()
  movieId: number;
}

export class MovieListItemDto {
  @ApiProperty({
    description: 'TMDB movie ID',
    example: 550,
  })
  movieId: number;

  @ApiProperty({
    description: 'Date when movie was added to the list',
    example: '2023-12-15T10:30:00Z',
  })
  addedAt: string;

  @ApiPropertyOptional({
    description: 'Detailed movie information from TMDB',
    nullable: true,
  })
  movieDetails?: {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    vote_average: number;
    genres: Array<{ id: number; name: string }>;
  } | null;
}

export class MovieListDto {
  @ApiProperty({
    description: 'Unique identifier for the movie list',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the movie list',
    example: 'My Favorite Movies',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Description of the movie list',
    example: 'A collection of my all-time favorite movies',
  })
  description?: string;

  @ApiProperty({
    description: 'Genre ID from TMDB',
    example: 28,
  })
  genreId: number;

  @ApiProperty({
    description: 'Genre name',
    example: 'Action',
  })
  genreName: string;

  @ApiProperty({
    description: 'User ID who owns the list',
    example: 'user123',
  })
  userId: string;

  @ApiProperty({
    description: 'Array of movies in the list',
    type: [MovieListItemDto],
  })
  movies: MovieListItemDto[];

  @ApiProperty({
    description: 'Date when the list was created',
    example: '2023-12-01T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the list was last updated',
    example: '2023-12-15T15:30:00Z',
  })
  updatedAt: Date;
}

export class MovieListSummaryDto {
  @ApiProperty({
    description: 'Unique identifier for the movie list',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the movie list',
    example: 'My Favorite Movies',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Description of the movie list',
    example: 'A collection of my all-time favorite movies',
  })
  description?: string;

  @ApiProperty({
    description: 'Genre name',
    example: 'Action',
  })
  genreName: string;

  @ApiProperty({
    description: 'Number of movies in the list',
    example: 15,
  })
  movieCount: number;

  @ApiProperty({
    description: 'Date when the list was created',
    example: '2023-12-01T10:00:00Z',
  })
  createdAt: Date;
}

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page (maximum 100)',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 10;
}
