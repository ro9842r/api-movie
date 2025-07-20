import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@shared/base/base.entity';

@Entity('movie_lists')
export class MovieList extends BaseEntity<MovieList> {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    name: 'genre_id',
  })
  genreId: number;

  @Column({
    name: 'genre_name',
  })
  genreName: string;

  @Column({
    name: 'user_id',
  })
  userId: string;

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
