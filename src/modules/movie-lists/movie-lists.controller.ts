import { Controller, Post, Body } from '@nestjs/common';
import { MovieListsService } from './movie-lists.service';
import { CreateMovieListDto, MovieListDto } from './dto/movie-list.dto';

@Controller('movie-lists')
export class MovieListsController {
  constructor(private readonly movieListsService: MovieListsService) {}

  @Post()
  async createList(
    @Body() createListDto: CreateMovieListDto,
  ): Promise<MovieListDto> {
    return this.movieListsService.createList(createListDto);
  }
}
