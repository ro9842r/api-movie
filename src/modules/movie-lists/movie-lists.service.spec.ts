import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovieListsService } from './movie-lists.service';
import { MovieList } from './entities/movie-list.entity';
import { MoviesService } from '@modules/movies/movies.service';
import { CreateMovieListDto } from './dto/movie-list.dto';

describe('MovieListsService', () => {
  let service: MovieListsService;
  let movieListRepositoryMock: jest.Mocked<Repository<MovieList>>;
  let moviesServiceMock: jest.Mocked<MoviesService>;

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
    };

    const mockMoviesService = {
      getGenreById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieListsService,
        {
          provide: getRepositoryToken(MovieList),
          useValue: mockRepository,
        },
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    service = module.get<MovieListsService>(MovieListsService);
    movieListRepositoryMock = module.get(getRepositoryToken(MovieList));
    moviesServiceMock = module.get(MoviesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createList', () => {
    const createListDto: CreateMovieListDto = {
      name: 'My Favorite Movies',
      description: 'A list of my favorite action movies',
      genreId: 28,
      genreName: 'Action',
    };

    const mockGenre = {
      id: 28,
      name: 'Action',
    };

    const mockCreatedList = {
      id: '456e7890-e89b-12d3-a456-426614174001',
      name: 'My Favorite Movies',
      description: 'A list of my favorite action movies',
      userId: '123e4567-e89b-12d3-a456-426614174000',
      genreId: 28,
      movies: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockSavedList = {
      ...mockCreatedList,
    };

    it('should create a movie list successfully', async () => {
      // Arrange
      moviesServiceMock.getGenreById.mockResolvedValue(mockGenre);
      movieListRepositoryMock.create.mockReturnValue(mockCreatedList as any);
      movieListRepositoryMock.save.mockResolvedValue(mockSavedList as any);

      const result = await service.createList(createListDto);

      expect(moviesServiceMock.getGenreById).toHaveBeenCalledWith(
        createListDto.genreId,
      );
      expect(movieListRepositoryMock.create).toHaveBeenCalledWith({
        ...createListDto,
        movies: [],
      });
      expect(movieListRepositoryMock.save).toHaveBeenCalledWith(
        mockCreatedList,
      );
      expect(result).toEqual(mockSavedList);
    });

    it('should throw error when genre does not exist', async () => {
      // Arrange
      const error = new Error('Genre with id 999 not found');
      moviesServiceMock.getGenreById.mockRejectedValue(error);

      // Act & Assert
      await expect(
        service.createList({
          ...createListDto,
          genreId: 999,
        }),
      ).rejects.toThrow('Genre with id 999 not found');

      expect(moviesServiceMock.getGenreById).toHaveBeenCalledWith(999);
      expect(movieListRepositoryMock.create).not.toHaveBeenCalled();
      expect(movieListRepositoryMock.save).not.toHaveBeenCalled();
    });

    it('should handle database errors during save', async () => {
      moviesServiceMock.getGenreById.mockResolvedValue(mockGenre);
      movieListRepositoryMock.create.mockReturnValue(mockCreatedList as any);
      movieListRepositoryMock.save.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(service.createList(createListDto)).rejects.toThrow(
        'Database connection failed',
      );

      expect(moviesServiceMock.getGenreById).toHaveBeenCalledWith(
        createListDto.genreId,
      );
      expect(movieListRepositoryMock.create).toHaveBeenCalledWith({
        ...createListDto,
        movies: [],
      });
      expect(movieListRepositoryMock.save).toHaveBeenCalledWith(
        mockCreatedList,
      );
    });

    it('should validate that movies array is initialized as empty', async () => {
      moviesServiceMock.getGenreById.mockResolvedValue(mockGenre);
      movieListRepositoryMock.create.mockReturnValue(mockCreatedList as any);
      movieListRepositoryMock.save.mockResolvedValue(mockSavedList as any);

      await service.createList(createListDto);

      expect(movieListRepositoryMock.create).toHaveBeenCalledWith(
        expect.objectContaining({
          movies: [],
        }),
      );
    });

    it('should pass all DTO properties to repository create', async () => {
      moviesServiceMock.getGenreById.mockResolvedValue(mockGenre);
      movieListRepositoryMock.create.mockReturnValue(mockCreatedList as any);
      movieListRepositoryMock.save.mockResolvedValue(mockSavedList as any);

      await service.createList(createListDto);

      expect(movieListRepositoryMock.create).toHaveBeenCalledWith({
        name: createListDto.name,
        description: createListDto.description,
        genreId: createListDto.genreId,
        genreName: createListDto.genreName,
        movies: [],
      });
    });
  });
});
