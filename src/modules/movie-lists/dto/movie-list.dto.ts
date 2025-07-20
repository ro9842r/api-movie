import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMovieListDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Type(() => Number)
  @IsNumber()
  genreId: number;

  @IsString()
  @IsNotEmpty()
  genreName: string;

  @IsUUID(4, { message: 'userId must be a valid UUID' })
  @IsNotEmpty()
  userId: string;
}

export class AddMovieToListDto {
  @Type(() => Number)
  @IsNumber()
  movieId: number;
}

export class MovieListItemDto {
  movieId: number;
  addedAt: string;
}

export class MovieListDto {
  id: string;
  name: string;
  description?: string;
  genreId: number;
  genreName: string;
  userId: string;
  movies: MovieListItemDto[];
  createdAt: Date;
  updatedAt: Date;
}

export class MovieListSummaryDto {
  id: string;
  name: string;
  description?: string;
  genreName: string;
  movieCount: number;
  createdAt: Date;
}
