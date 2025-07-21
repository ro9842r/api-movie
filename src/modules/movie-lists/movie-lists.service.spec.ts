import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovieListsService } from './movie-lists.service';
import { MovieList } from './entities/movie-list.entity';
import { MoviesService } from '@modules/movies/movies.service';
import { CreateMovieListDto } from './dto/movie-list.dto';
import { UserContext } from '../../auth/context/user.context';

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
      remove: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const mockMoviesService = {
      getGenreById: jest.fn(),
      getMovieById: jest.fn(),
    };

    const mockUserContext = {
      currentUserId: 'mock-user-id',
      currentUser: { id: 'mock-user-id', email: 'test@example.com' },
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
        {
          provide: UserContext,
          useValue: mockUserContext,
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
        userId: 'mock-user-id',
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
        userId: 'mock-user-id',
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
        userId: 'mock-user-id',
        movies: [],
      });
    });
  });

  describe('addMovieToList', () => {
    const listId = '456e7890-e89b-12d3-a456-426614174001';
    const addMovieDto = { listId: listId, movieId: 123 };

    const mockMovieList = {
      id: listId,
      name: 'Action Movies',
      description: 'My favorite action movies',
      genreId: 28,
      genreName: 'Action',
      userId: 'mock-user-id',
      movies: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockMovieDetails = {
      id: 123,
      title: 'Test Movie',
      genres: [
        { id: 28, name: 'Action' },
        { id: 12, name: 'Adventure' },
      ],
      overview: 'A test movie',
      release_date: '2023-01-01',
      vote_average: 8.5,
      popularity: 100,
    };

    it('should add movie to list successfully', async () => {
      // Arrange
      movieListRepositoryMock.findOne.mockResolvedValue(mockMovieList as any);
      moviesServiceMock.getMovieById.mockResolvedValue(mockMovieDetails as any);
      const updatedList = {
        ...mockMovieList,
        movies: [{ movieId: 123, addedAt: expect.any(String) }],
      };
      movieListRepositoryMock.save.mockResolvedValue(updatedList as any);

      // Act
      const result = await service.addMovieToList(addMovieDto);

      // Assert
      expect(movieListRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: listId, userId: 'mock-user-id' },
      });
      expect(moviesServiceMock.getMovieById).toHaveBeenCalledWith(123);
      expect(movieListRepositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining({
          movies: [{ movieId: 123, addedAt: expect.any(String) }],
        }),
      );
      expect(result).toEqual(updatedList);
    });

    it('should throw error when movie list not found', async () => {
      // Arrange
      movieListRepositoryMock.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.addMovieToList(addMovieDto)).rejects.toThrow(
        'Movie list not found',
      );

      expect(movieListRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: listId, userId: 'mock-user-id' },
      });
      expect(moviesServiceMock.getMovieById).not.toHaveBeenCalled();
      expect(movieListRepositoryMock.save).not.toHaveBeenCalled();
    });

    it('should throw error when movie does not belong to list genre', async () => {
      // Arrange
      const movieWithDifferentGenre = {
        ...mockMovieDetails,
        genres: [{ id: 35, name: 'Comedy' }], // Different genre
      };
      movieListRepositoryMock.findOne.mockResolvedValue(mockMovieList as any);
      moviesServiceMock.getMovieById.mockResolvedValue(
        movieWithDifferentGenre as any,
      );

      // Act & Assert
      await expect(service.addMovieToList(addMovieDto)).rejects.toThrow(
        'Movie does not belong to the genre "Action"',
      );

      expect(movieListRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: listId, userId: 'mock-user-id' },
      });
      expect(moviesServiceMock.getMovieById).toHaveBeenCalledWith(123);
      expect(movieListRepositoryMock.save).not.toHaveBeenCalled();
    });

    it('should throw error when movie is already in the list', async () => {
      // Arrange
      const listWithMovie = {
        ...mockMovieList,
        movies: [{ movieId: 123, addedAt: '2023-01-01T00:00:00.000Z' }],
      };
      movieListRepositoryMock.findOne.mockResolvedValue(listWithMovie as any);
      moviesServiceMock.getMovieById.mockResolvedValue(mockMovieDetails as any);

      // Act & Assert
      await expect(service.addMovieToList(addMovieDto)).rejects.toThrow(
        'Movie is already in this list',
      );

      expect(movieListRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: listId, userId: 'mock-user-id' },
      });
      expect(moviesServiceMock.getMovieById).toHaveBeenCalledWith(123);
      expect(movieListRepositoryMock.save).not.toHaveBeenCalled();
    });

    it('should handle movie API errors', async () => {
      // Arrange
      movieListRepositoryMock.findOne.mockResolvedValue(mockMovieList as any);
      moviesServiceMock.getMovieById.mockRejectedValue(
        new Error('Movie not found in TMDB'),
      );

      // Act & Assert
      await expect(service.addMovieToList(addMovieDto)).rejects.toThrow(
        'Movie not found in TMDB',
      );

      expect(movieListRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: listId, userId: 'mock-user-id' },
      });
      expect(moviesServiceMock.getMovieById).toHaveBeenCalledWith(123);
      expect(movieListRepositoryMock.save).not.toHaveBeenCalled();
    });

    it('should add movie to list with existing movies', async () => {
      // Arrange
      const listWithExistingMovies = {
        ...mockMovieList,
        movies: [
          { movieId: 456, addedAt: '2023-01-01T00:00:00.000Z' },
          { movieId: 789, addedAt: '2023-01-02T00:00:00.000Z' },
        ],
      };
      movieListRepositoryMock.findOne.mockResolvedValue(
        listWithExistingMovies as any,
      );
      moviesServiceMock.getMovieById.mockResolvedValue(mockMovieDetails as any);
      const updatedList = {
        ...listWithExistingMovies,
        movies: [
          ...listWithExistingMovies.movies,
          { movieId: 123, addedAt: expect.any(String) },
        ],
      };
      movieListRepositoryMock.save.mockResolvedValue(updatedList as any);

      // Act
      const result = await service.addMovieToList(addMovieDto);

      // Assert
      expect(movieListRepositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining({
          movies: [
            { movieId: 456, addedAt: '2023-01-01T00:00:00.000Z' },
            { movieId: 789, addedAt: '2023-01-02T00:00:00.000Z' },
            { movieId: 123, addedAt: expect.any(String) },
          ],
        }),
      );
      expect(result).toEqual(updatedList);
    });
  });
});
