import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseFilters,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { MovieListsService } from './movie-lists.service';
import {
  CreateMovieListDto,
  MovieListDto,
  PaginationQueryDto,
} from './dto/movie-list.dto';
import { MovieList } from './entities/movie-list.entity';
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

  @Get()
  async findMyLists(
    @Request() req: any,
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<Pagination<MovieList>> {
    const userId = req.user.id;

    const options = {
      page: paginationQuery.page || 1,
      limit: paginationQuery.limit || 10,
    };
    return this.movieListsService.findByUserId(userId, options);
  }
}
