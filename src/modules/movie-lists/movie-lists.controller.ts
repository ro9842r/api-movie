import {
  Controller,
  Post,
  Body,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { MovieListsService } from './movie-lists.service';
import { CreateMovieListDto, MovieListDto } from './dto/movie-list.dto';
import { DatabaseExceptionFilter } from '@shared/filters/database-exception.filter';
import { TransformInterceptor } from '@shared/interceptors/transform.interceptor';

@Controller('movie-lists')
@UseFilters(DatabaseExceptionFilter)
@UseInterceptors(TransformInterceptor)
export class MovieListsController {
  constructor(private readonly movieListsService: MovieListsService) {}

  @Post()
  async createList(
    @Body() createListDto: CreateMovieListDto,
  ): Promise<MovieListDto> {
    return this.movieListsService.createList(createListDto);
  }
}
