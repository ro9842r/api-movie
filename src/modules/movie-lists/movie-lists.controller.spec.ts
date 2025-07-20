import { Test, TestingModule } from '@nestjs/testing';
import { MovieListsController } from './movie-lists.controller';
import { MovieListsService } from './movie-lists.service';
import {
  CreateMovieListDto,
  MovieListDto,
  PaginationQueryDto,
  AddMovieToListDto,
} from './dto/movie-list.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('MovieListsController', () => {
  let controller: MovieListsController;
  let movieListsServiceMock: jest.Mocked<MovieListsService>;

  beforeEach(async () => {
    const mockMovieListsService = {
      createList: jest.fn(),
      getUserLists: jest.fn(),
      addMovieToList: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieListsController],
      providers: [
        {
          provide: MovieListsService,
          useValue: mockMovieListsService,
        },
      ],
    }).compile();

    controller = module.get<MovieListsController>(MovieListsController);
    movieListsServiceMock = module.get(MovieListsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createList', () => {
    const createListDto: CreateMovieListDto = {
      name: 'My Action Movies',
      description: 'A collection of my favorite action movies',
      genreId: 28,
      genreName: 'Action',
    };

    const mockCreatedList: MovieListDto = {
      id: '456e7890-e89b-12d3-a456-426614174001',
      name: 'My Action Movies',
      description: 'A collection of my favorite action movies',
      genreId: 28,
      genreName: 'Action',
      userId: 'mock-user-id',
      movies: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create a movie list successfully', async () => {
      // Arrange
      movieListsServiceMock.createList.mockResolvedValue(mockCreatedList);

      // Act
      const result = await controller.createList(createListDto);

      // Assert
      expect(movieListsServiceMock.createList).toHaveBeenCalledWith(
        createListDto,
      );
      expect(result).toEqual(mockCreatedList);
    });

    it('should handle service errors during list creation', async () => {
      // Arrange
      const error = new HttpException('Genre not found', HttpStatus.NOT_FOUND);
      movieListsServiceMock.createList.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.createList(createListDto)).rejects.toThrow(
        'Genre not found',
      );
      expect(movieListsServiceMock.createList).toHaveBeenCalledWith(
        createListDto,
      );
    });
  });

  describe('findMyLists', () => {
    const paginationQuery: PaginationQueryDto = {
      page: 1,
      limit: 10,
    };

    const mockPaginatedResult = {
      items: [
        {
          id: '456e7890-e89b-12d3-a456-426614174001',
          name: 'Action Movies',
          description: 'My favorite action movies',
          genreId: 28,
          genreName: 'Action',
          userId: 'mock-user-id',
          movies: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      meta: {
        itemCount: 1,
        totalItems: 1,
        itemsPerPage: 10,
        totalPages: 1,
        currentPage: 1,
      },
    };

    it('should return paginated movie lists', async () => {
      // Arrange
      movieListsServiceMock.getUserLists.mockResolvedValue(
        mockPaginatedResult as any,
      );

      // Act
      const result = await controller.findMyLists(paginationQuery);

      // Assert
      expect(movieListsServiceMock.getUserLists).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
      });
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should use default pagination values when not provided', async () => {
      // Arrange
      const emptyQuery = {} as PaginationQueryDto;
      movieListsServiceMock.getUserLists.mockResolvedValue(
        mockPaginatedResult as any,
      );

      // Act
      await controller.findMyLists(emptyQuery);

      // Assert
      expect(movieListsServiceMock.getUserLists).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
      });
    });

    it('should handle custom pagination values', async () => {
      // Arrange
      const customQuery: PaginationQueryDto = { page: 2, limit: 5 };
      movieListsServiceMock.getUserLists.mockResolvedValue(
        mockPaginatedResult as any,
      );

      // Act
      await controller.findMyLists(customQuery);

      // Assert
      expect(movieListsServiceMock.getUserLists).toHaveBeenCalledWith({
        page: 2,
        limit: 5,
      });
    });
  });

  describe('addMovieToList', () => {
    const listId = '456e7890-e89b-12d3-a456-426614174001';
    const addMovieDto: AddMovieToListDto = {
      listId: listId,
      movieId: 123,
    };

    const mockUpdatedList: MovieListDto = {
      id: listId,
      name: 'Action Movies',
      description: 'My favorite action movies',
      genreId: 28,
      genreName: 'Action',
      userId: 'mock-user-id',
      movies: [
        {
          movieId: 123,
          addedAt: '2023-12-01T10:00:00.000Z',
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should add movie to list successfully', async () => {
      // Arrange
      movieListsServiceMock.addMovieToList.mockResolvedValue(mockUpdatedList);

      // Act
      const result = await controller.addMovieToList(addMovieDto);

      // Assert
      expect(movieListsServiceMock.addMovieToList).toHaveBeenCalledWith(
        addMovieDto,
      );
      expect(result).toEqual(mockUpdatedList);
    });

    it('should handle list not found error', async () => {
      // Arrange
      const error = new HttpException(
        'Movie list not found',
        HttpStatus.NOT_FOUND,
      );
      movieListsServiceMock.addMovieToList.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.addMovieToList(addMovieDto)).rejects.toThrow(
        'Movie list not found',
      );
      expect(movieListsServiceMock.addMovieToList).toHaveBeenCalledWith(
        addMovieDto,
      );
    });

    it('should handle genre mismatch error', async () => {
      // Arrange
      const error = new HttpException(
        'Movie does not belong to the genre "Action"',
        HttpStatus.BAD_REQUEST,
      );
      movieListsServiceMock.addMovieToList.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.addMovieToList(addMovieDto)).rejects.toThrow(
        'Movie does not belong to the genre "Action"',
      );
      expect(movieListsServiceMock.addMovieToList).toHaveBeenCalledWith(
        addMovieDto,
      );
    });

    it('should handle movie already in list error', async () => {
      // Arrange
      const error = new HttpException(
        'Movie is already in this list',
        HttpStatus.CONFLICT,
      );
      movieListsServiceMock.addMovieToList.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.addMovieToList(addMovieDto)).rejects.toThrow(
        'Movie is already in this list',
      );
      expect(movieListsServiceMock.addMovieToList).toHaveBeenCalledWith(
        addMovieDto,
      );
    });

    it('should handle movie API errors', async () => {
      // Arrange
      const error = new HttpException(
        'Movie not found in TMDB',
        HttpStatus.NOT_FOUND,
      );
      movieListsServiceMock.addMovieToList.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.addMovieToList(addMovieDto)).rejects.toThrow(
        'Movie not found in TMDB',
      );
      expect(movieListsServiceMock.addMovieToList).toHaveBeenCalledWith(
        addMovieDto,
      );
    });
  });
});
