import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Body,
  Query,
  Param,
  UseFilters,
  UseInterceptors,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { MovieListsService } from './movie-lists.service';
import {
  CreateMovieListDto,
  MovieListDto,
  PaginationQueryDto,
  AddMovieToListDto,
  UpdateMovieListDto,
  RemoveMovieFromListDto,
} from './dto/movie-list.dto';
import { MovieList } from './entities/movie-list.entity';
import { DatabaseExceptionFilter } from '@shared/filters/database-exception.filter';
import { TransformInterceptor } from '@shared/interceptors/transform.interceptor';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AuthRequired } from '../../auth/decorators';

@UseGuards(JwtAuthGuard)
@Controller('movie-lists')
@UseFilters(DatabaseExceptionFilter)
@UseInterceptors(TransformInterceptor)
@AuthRequired()
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
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<Pagination<MovieList>> {
    const options = {
      page: paginationQuery.page || 1,
      limit: paginationQuery.limit || 10,
    };
    return this.movieListsService.getUserLists(options);
  }

  @Post('movie')
  async addMovieToList(
    @Body() addMovieDto: AddMovieToListDto,
  ): Promise<MovieListDto> {
    return this.movieListsService.addMovieToList(addMovieDto);
  }

  @Get(':id')
  async getMoviesByListId(
    @Param('id', ParseUUIDPipe) listId: string,
  ): Promise<MovieList> {
    return this.movieListsService.getMoviesByListId(listId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteList(@Param('id', ParseUUIDPipe) listId: string): Promise<void> {
    return this.movieListsService.deleteList(listId);
  }

  @Patch(':id')
  async updateList(
    @Param('id', ParseUUIDPipe) listId: string,
    @Body() updateListDto: UpdateMovieListDto,
  ): Promise<MovieListDto> {
    return this.movieListsService.updateList(listId, updateListDto);
  }

  @Delete('movie')
  async removeMovieFromList(
    @Body() removeMovieDto: RemoveMovieFromListDto,
  ): Promise<MovieListDto> {
    return this.movieListsService.removeMovieFromList(removeMovieDto);
  }
}
