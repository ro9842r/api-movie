import { IsNotEmpty, IsString } from 'class-validator';

export class SearchMovieDto {
  @IsString()
  @IsNotEmpty()
  query: string;
}

export class MovieDto {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  adult: boolean;
  genre_ids: number[];
  original_language: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  video: boolean;
}

export class SearchMovieResponseDto {
  page: number;
  results: MovieDto[];
  total_pages: number;
  total_results: number;
}

export class GenreDto {
  id: number;
  name: string;
}

export class GenresResponseDto {
  genres: GenreDto[];
}
