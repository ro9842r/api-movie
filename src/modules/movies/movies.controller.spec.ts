import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import {
  SearchMovieDto,
  SearchMovieResponseDto,
  GenresResponseDto,
  DiscoverMoviesDto,
  MovieDetailsDto,
} from './dto/search-movie.dto';

describe('MoviesController', () => {
  let controller: MoviesController;
  let mockMoviesService: {
    searchMoviesByName: jest.Mock;
    getGenres: jest.Mock;
    getPopularMovies: jest.Mock;
    getNowPlayingMovies: jest.Mock;
    discoverMovies: jest.Mock;
    getMovieById: jest.Mock;
  };

  beforeEach(async () => {
    mockMoviesService = {
      searchMoviesByName: jest.fn(),
      getGenres: jest.fn(),
      getPopularMovies: jest.fn(),
      getNowPlayingMovies: jest.fn(),
      discoverMovies: jest.fn(),
      getMovieById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('searchMoviesByName', () => {
    it('should return search results when search is successful', async () => {
      const searchDto: SearchMovieDto = { query: 'batman' };
      const expectedResult: SearchMovieResponseDto = {
        page: 1,
        results: [
          {
            id: 1,
            title: 'Batman',
            original_title: 'Batman',
            overview: 'Batman movie description',
            poster_path: '/poster.jpg',
            backdrop_path: '/backdrop.jpg',
            release_date: '2022-01-01',
            adult: false,
            genre_ids: [28, 12],
            original_language: 'en',
            popularity: 100,
            vote_average: 8.5,
            vote_count: 1000,
            video: false,
          },
        ],
        total_pages: 1,
        total_results: 1,
      };

      mockMoviesService.searchMoviesByName.mockResolvedValue(expectedResult);

      const result = await controller.searchMoviesByName(searchDto);

      expect(result).toEqual(expectedResult);
      expect(mockMoviesService.searchMoviesByName).toHaveBeenCalledWith(
        searchDto,
      );
      expect(mockMoviesService.searchMoviesByName).toHaveBeenCalledTimes(1);
    });

    it('should handle service errors properly', async () => {
      const searchDto: SearchMovieDto = { query: 'batman' };
      const error = new Error('Service error');

      mockMoviesService.searchMoviesByName.mockRejectedValue(error);

      await expect(controller.searchMoviesByName(searchDto)).rejects.toThrow(
        'Service error',
      );
      expect(mockMoviesService.searchMoviesByName).toHaveBeenCalledWith(
        searchDto,
      );
    });
  });

  describe('getGenres', () => {
    it('should return genres list', async () => {
      const expectedGenres: GenresResponseDto = {
        genres: [
          { id: 28, name: 'Action' },
          { id: 12, name: 'Adventure' },
          { id: 16, name: 'Animation' },
        ],
      };

      mockMoviesService.getGenres.mockResolvedValue(expectedGenres);

      const result = await controller.getGenres();

      expect(result).toEqual(expectedGenres);
      expect(mockMoviesService.getGenres).toHaveBeenCalledWith();
      expect(mockMoviesService.getGenres).toHaveBeenCalledTimes(1);
    });

    it('should handle service errors when fetching genres', async () => {
      const error = new Error('Failed to fetch genres');

      mockMoviesService.getGenres.mockRejectedValue(error);

      await expect(controller.getGenres()).rejects.toThrow(
        'Failed to fetch genres',
      );
    });
  });

  describe('getPopularMovies', () => {
    it('should return popular movies with default page', async () => {
      const expectedResult: SearchMovieResponseDto = {
        page: 1,
        results: [],
        total_pages: 10,
        total_results: 200,
      };

      mockMoviesService.getPopularMovies.mockResolvedValue(expectedResult);

      const result = await controller.getPopularMovies(1);

      expect(result).toEqual(expectedResult);
      expect(mockMoviesService.getPopularMovies).toHaveBeenCalledWith(1);
      expect(mockMoviesService.getPopularMovies).toHaveBeenCalledTimes(1);
    });

    it('should return popular movies with specific page', async () => {
      const expectedResult: SearchMovieResponseDto = {
        page: 3,
        results: [],
        total_pages: 10,
        total_results: 200,
      };

      mockMoviesService.getPopularMovies.mockResolvedValue(expectedResult);

      const result = await controller.getPopularMovies(3);

      expect(result).toEqual(expectedResult);
      expect(mockMoviesService.getPopularMovies).toHaveBeenCalledWith(3);
    });

    it('should handle service errors for popular movies', async () => {
      const error = new Error('Failed to fetch popular movies');

      mockMoviesService.getPopularMovies.mockRejectedValue(error);

      await expect(controller.getPopularMovies(1)).rejects.toThrow(
        'Failed to fetch popular movies',
      );
    });
  });

  describe('getNowPlayingMovies', () => {
    it('should return now playing movies', async () => {
      const expectedResult: SearchMovieResponseDto = {
        page: 1,
        results: [],
        total_pages: 5,
        total_results: 100,
      };

      mockMoviesService.getNowPlayingMovies.mockResolvedValue(expectedResult);

      const result = await controller.getNowPlayingMovies(1);

      expect(result).toEqual(expectedResult);
      expect(mockMoviesService.getNowPlayingMovies).toHaveBeenCalledWith(1);
      expect(mockMoviesService.getNowPlayingMovies).toHaveBeenCalledTimes(1);
    });

    it('should handle service errors for now playing movies', async () => {
      const error = new Error('Failed to fetch now playing movies');

      mockMoviesService.getNowPlayingMovies.mockRejectedValue(error);

      await expect(controller.getNowPlayingMovies(1)).rejects.toThrow(
        'Failed to fetch now playing movies',
      );
    });
  });

  describe('discoverMovies', () => {
    it('should discover movies with filters', async () => {
      const discoverDto: DiscoverMoviesDto = {
        page: 1,
        year: 2023,
        with_genres: '28,12',
      };

      const expectedResult: SearchMovieResponseDto = {
        page: 1,
        results: [],
        total_pages: 3,
        total_results: 50,
      };

      mockMoviesService.discoverMovies.mockResolvedValue(expectedResult);

      const result = await controller.discoverMovies(discoverDto);

      expect(result).toEqual(expectedResult);
      expect(mockMoviesService.discoverMovies).toHaveBeenCalledWith(
        discoverDto,
      );
      expect(mockMoviesService.discoverMovies).toHaveBeenCalledTimes(1);
    });

    it('should discover movies with minimal parameters', async () => {
      const discoverDto: DiscoverMoviesDto = { page: 1 };

      const expectedResult: SearchMovieResponseDto = {
        page: 1,
        results: [],
        total_pages: 10,
        total_results: 200,
      };

      mockMoviesService.discoverMovies.mockResolvedValue(expectedResult);

      const result = await controller.discoverMovies(discoverDto);

      expect(result).toEqual(expectedResult);
      expect(mockMoviesService.discoverMovies).toHaveBeenCalledWith(
        discoverDto,
      );
    });

    it('should handle service errors for discover movies', async () => {
      const discoverDto: DiscoverMoviesDto = { page: 1 };
      const error = new Error('Failed to discover movies');

      mockMoviesService.discoverMovies.mockRejectedValue(error);

      await expect(controller.discoverMovies(discoverDto)).rejects.toThrow(
        'Failed to discover movies',
      );
    });
  });

  describe('getMovieById', () => {
    it('should return movie details when movie exists', async () => {
      const movieId = 550;
      const expectedMovie: MovieDetailsDto = {
        id: 550,
        title: 'Fight Club',
        original_title: 'Fight Club',
        overview:
          'A ticking-time-bomb insomniac and a slippery soap salesman...',
        poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
        backdrop_path: '/fCayJrkfRaCRCTh8GqN30f8oyQF.jpg',
        release_date: '1999-10-15',
        runtime: 139,
        vote_average: 8.433,
        vote_count: 27280,
        popularity: 61.416,
        adult: false,
        genres: [
          { id: 18, name: 'Drama' },
          { id: 53, name: 'Thriller' },
        ],
        production_companies: [
          {
            id: 508,
            name: '20th Century Fox',
            logo_path: '/7PzJdsLGlR7oW4J0J5Xcd0pHGRg.png',
          },
        ],
        budget: 63000000,
        revenue: 100853753,
        tagline: 'Mischief. Mayhem. Soap.',
        homepage: 'http://www.foxmovies.com/movies/fight-club',
      };

      mockMoviesService.getMovieById.mockResolvedValue(expectedMovie);

      const result = await controller.getMovieById(movieId);

      expect(result).toEqual(expectedMovie);
      expect(() => mockMoviesService.getMovieById).not.toThrow();
      expect(mockMoviesService.getMovieById).toHaveBeenCalledWith(movieId);
      expect(mockMoviesService.getMovieById).toHaveBeenCalledTimes(1);
    });

    it('should handle service errors when movie not found', async () => {
      const movieId = 999999;
      const error = new Error('Movie not found');

      mockMoviesService.getMovieById.mockRejectedValue(error);

      await expect(controller.getMovieById(movieId)).rejects.toThrow(
        'Movie not found',
      );
      expect(mockMoviesService.getMovieById).toHaveBeenCalledWith(movieId);
    });

    it('should handle invalid movie ID', async () => {
      const movieId = -1;
      const error = new BadRequestException('Invalid movie ID');

      mockMoviesService.getMovieById.mockRejectedValue(error);

      await expect(controller.getMovieById(movieId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('Controller Integration', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should have MoviesService injected', () => {
      expect(mockMoviesService).toBeDefined();
    });
  });
});
