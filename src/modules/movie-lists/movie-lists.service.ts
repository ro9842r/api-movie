import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MoviesService } from '@modules/movies/movies.service';
import { CreateMovieListDto, MovieListDto } from './dto/movie-list.dto';
import { MovieList } from './entities/movie-list.entity';

@Injectable()
export class MovieListsService {
  constructor(
    @InjectRepository(MovieList)
    private readonly movieListRepository: Repository<MovieList>,
    private readonly moviesService: MoviesService,
  ) {}

  async createList(createListDto: CreateMovieListDto): Promise<MovieListDto> {
    await this.moviesService.getGenreById(createListDto.genreId);

    const newList = this.movieListRepository.create({
      ...createListDto,
      movies: [],
    });

    return this.movieListRepository.save(newList);
  }
}
