import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '@shared/base/base.entity';

@Entity('movie_lists')
export class MovieList extends BaseEntity<MovieList> {
  @ApiProperty({
    description: 'Name of the movie list',
    example: 'My Favorite Action Movies',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Description of the movie list',
    example: 'A collection of my favorite action-packed movies',
  })
  @Column()
  description: string;

  @ApiProperty({
    description: 'Genre ID from TMDB',
    example: 28,
  })
  @Column({
    name: 'genre_id',
  })
  genreId: number;

  @ApiProperty({
    description: 'Genre name',
    example: 'Action',
  })
  @Column({
    name: 'genre_name',
  })
  genreName: string;

  @ApiProperty({
    description: 'User ID who owns the list',
    example: 'user123',
  })
  @Column({
    name: 'user_id',
  })
  userId: string;

  @ApiProperty({
    description: 'Array of movies in the list with metadata',
    example: [
      {
        movieId: 550,
        addedAt: '2023-12-15T10:30:00Z',
      },
    ],
  })
  @Column({
    type: 'jsonb',
    default: '[]',
  })
  movies: Array<{
    movieId: number;
    addedAt: string;
  }>;

  constructor(movieList: Partial<MovieList>) {
    super(movieList);
  }
}
