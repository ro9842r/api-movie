import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchMovieDto {
  @ApiProperty({
    description: 'Movie title or keywords to search for',
    example: 'The Matrix',
  })
  @IsString()
  @IsNotEmpty()
  query: string;
}

export class DiscoverMoviesDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Filter movies by release year',
    example: 2023,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  year?: number;

  @ApiPropertyOptional({
    description: 'Filter by genre IDs (comma-separated)',
    example: '28,12',
  })
  @IsOptional()
  @IsString()
  with_genres?: string;
}

export class MovieDto {
  @ApiProperty({ description: 'TMDB movie ID', example: 550 })
  id: number;

  @ApiProperty({ description: 'Movie title', example: 'Fight Club' })
  title: string;

  @ApiProperty({ description: 'Original movie title', example: 'Fight Club' })
  original_title: string;

  @ApiProperty({
    description: 'Movie plot overview',
    example: 'A ticking-time-bomb insomniac...',
  })
  overview: string;

  @ApiProperty({
    description: 'Poster image path',
    example: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    nullable: true,
  })
  poster_path: string | null;

  @ApiProperty({
    description: 'Backdrop image path',
    example: '/fCayJrkfRaCRCTh8GqN30f8oyQF.jpg',
    nullable: true,
  })
  backdrop_path: string | null;

  @ApiProperty({ description: 'Release date', example: '1999-10-15' })
  release_date: string;

  @ApiProperty({ description: 'Adult content flag', example: false })
  adult: boolean;

  @ApiProperty({
    description: 'Array of genre IDs',
    example: [18, 53],
    type: [Number],
  })
  genre_ids: number[];

  @ApiProperty({ description: 'Original language', example: 'en' })
  original_language: string;

  @ApiProperty({ description: 'Popularity score', example: 63.869 })
  popularity: number;

  @ApiProperty({ description: 'Average rating', example: 8.433 })
  vote_average: number;

  @ApiProperty({ description: 'Total votes count', example: 26280 })
  vote_count: number;

  @ApiProperty({ description: 'Has video flag', example: false })
  video: boolean;
}

export class SearchMovieResponseDto {
  @ApiProperty({ description: 'Current page number', example: 1 })
  page: number;

  @ApiProperty({
    description: 'Array of movies',
    type: [MovieDto],
  })
  results: MovieDto[];

  @ApiProperty({ description: 'Total number of pages', example: 500 })
  total_pages: number;

  @ApiProperty({ description: 'Total number of results', example: 10000 })
  total_results: number;
}

export class GenreDto {
  @ApiProperty({ description: 'Genre ID', example: 28 })
  id: number;

  @ApiProperty({ description: 'Genre name', example: 'Action' })
  name: string;
}

export class GenresResponseDto {
  @ApiProperty({
    description: 'Array of available genres',
    type: [GenreDto],
  })
  genres: GenreDto[];
}

export class MovieDetailsDto {
  @ApiProperty({ description: 'TMDB movie ID', example: 550 })
  id: number;

  @ApiProperty({ description: 'Movie title', example: 'Fight Club' })
  title: string;

  @ApiProperty({ description: 'Original movie title', example: 'Fight Club' })
  original_title: string;

  @ApiProperty({
    description: 'Movie plot overview',
    example: 'A ticking-time-bomb insomniac...',
  })
  overview: string;

  @ApiProperty({
    description: 'Poster image path',
    example: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    nullable: true,
  })
  poster_path: string | null;

  @ApiProperty({
    description: 'Backdrop image path',
    example: '/fCayJrkfRaCRCTh8GqN30f8oyQF.jpg',
    nullable: true,
  })
  backdrop_path: string | null;

  @ApiProperty({ description: 'Release date', example: '1999-10-15' })
  release_date: string;

  @ApiProperty({
    description: 'Runtime in minutes',
    example: 139,
    nullable: true,
  })
  runtime: number | null;

  @ApiProperty({ description: 'Average rating', example: 8.433 })
  vote_average: number;

  @ApiProperty({ description: 'Total votes count', example: 26280 })
  vote_count: number;

  @ApiProperty({ description: 'Popularity score', example: 63.869 })
  popularity: number;

  @ApiProperty({ description: 'Adult content flag', example: false })
  adult: boolean;

  @ApiProperty({
    description: 'Array of movie genres',
    type: [GenreDto],
  })
  genres: GenreDto[];

  @ApiProperty({
    description: 'Production companies',
    example: [
      {
        id: 508,
        name: 'Regency Enterprises',
        logo_path: '/7PzJdsLGlR7oW4J0J5Xcd0pHGRg.png',
      },
    ],
  })
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
  }[];

  @ApiProperty({ description: 'Movie budget in USD', example: 63000000 })
  budget: number;

  @ApiProperty({ description: 'Movie revenue in USD', example: 100853753 })
  revenue: number;

  @ApiProperty({
    description: 'Movie tagline',
    example: 'Mischief. Mayhem. Soap.',
    nullable: true,
  })
  tagline: string | null;

  @ApiProperty({
    description: 'Official movie homepage',
    example: 'http://www.foxmovies.com/movies/fight-club',
    nullable: true,
  })
  homepage: string | null;
}
