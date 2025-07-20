import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { MoviesService } from './movies.service';
import {
  SearchMovieDto,
  SearchMovieResponseDto,
  DiscoverMoviesDto,
  MovieDetailsDto,
} from './dto/search-movie.dto';

describe('MoviesService', () => {
  let service: MoviesService;

  const mockHttpService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: 'TMDB_HTTP_SERVICE',
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('searchMoviesByName', () => {
    it('should return movies when search is successful', async () => {
      const searchDto: SearchMovieDto = { query: 'batman' };
      const mockResponse: SearchMovieResponseDto = {
        page: 1,
        results: [
          {
            id: 1,
            title: 'Batman',
            original_title: 'Batman',
            overview: 'Batman movie',
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

      mockHttpService.get.mockReturnValue(of({ data: mockResponse }));

      const result = await service.searchMoviesByName(searchDto);

      expect(result).toEqual(mockResponse);
      expect(mockHttpService.get).toHaveBeenCalledWith('/search/movie', {
        params: { query: 'batman' },
      });
    });

    it('should throw HttpException when search fails', async () => {
      const searchDto: SearchMovieDto = { query: 'batman' };
      const errorResponse = {
        response: { status: 404 },
        message: 'Not found',
      };

      mockHttpService.get.mockReturnValue(throwError(() => errorResponse));

      await expect(service.searchMoviesByName(searchDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('getGenres', () => {
    it('should return genres when request is successful', async () => {
      const mockGenres = {
        genres: [
          { id: 28, name: 'Action' },
          { id: 12, name: 'Adventure' },
        ],
      };

      mockHttpService.get.mockReturnValue(of({ data: mockGenres }));

      const result = await service.getGenres();

      expect(result).toEqual(mockGenres);
      expect(mockHttpService.get).toHaveBeenCalledWith('/genre/movie/list');
    });

    it('should throw HttpException when genres request fails', async () => {
      const errorResponse = {
        response: { status: 500 },
        message: 'Server error',
      };

      mockHttpService.get.mockReturnValue(throwError(() => errorResponse));

      await expect(service.getGenres()).rejects.toThrow(HttpException);
    });
  });

  describe('getPopularMovies', () => {
    it('should return popular movies with default page', async () => {
      const mockResponse: SearchMovieResponseDto = {
        page: 1,
        results: [],
        total_pages: 10,
        total_results: 200,
      };

      mockHttpService.get.mockReturnValue(of({ data: mockResponse }));

      const result = await service.getPopularMovies();

      expect(result).toEqual(mockResponse);
      expect(mockHttpService.get).toHaveBeenCalledWith('/movie/popular', {
        params: { page: 1 },
      });
    });

    it('should return popular movies with specific page', async () => {
      const mockResponse: SearchMovieResponseDto = {
        page: 2,
        results: [],
        total_pages: 10,
        total_results: 200,
      };

      mockHttpService.get.mockReturnValue(of({ data: mockResponse }));

      const result = await service.getPopularMovies(2);

      expect(result).toEqual(mockResponse);
      expect(mockHttpService.get).toHaveBeenCalledWith('/movie/popular', {
        params: { page: 2 },
      });
    });
  });

  describe('getNowPlayingMovies', () => {
    it('should return now playing movies', async () => {
      const mockResponse: SearchMovieResponseDto = {
        page: 1,
        results: [],
        total_pages: 5,
        total_results: 100,
      };

      mockHttpService.get.mockReturnValue(of({ data: mockResponse }));

      const result = await service.getNowPlayingMovies();

      expect(result).toEqual(mockResponse);
      expect(mockHttpService.get).toHaveBeenCalledWith('/movie/now_playing', {
        params: { page: 1 },
      });
    });
  });

  describe('discoverMovies', () => {
    it('should discover movies with all filters', async () => {
      const discoverDto: DiscoverMoviesDto = {
        page: 1,
        year: 2023,
        with_genres: '28,12',
      };

      const mockResponse: SearchMovieResponseDto = {
        page: 1,
        results: [],
        total_pages: 3,
        total_results: 50,
      };

      mockHttpService.get.mockReturnValue(of({ data: mockResponse }));

      const result = await service.discoverMovies(discoverDto);

      expect(result).toEqual(mockResponse);
      expect(mockHttpService.get).toHaveBeenCalledWith('/discover/movie', {
        params: {
          page: 1,
          year: 2023,
          with_genres: '28,12',
        },
      });
    });

    it('should discover movies with only page parameter', async () => {
      const discoverDto: DiscoverMoviesDto = { page: 2 };

      const mockResponse: SearchMovieResponseDto = {
        page: 2,
        results: [],
        total_pages: 10,
        total_results: 200,
      };

      mockHttpService.get.mockReturnValue(of({ data: mockResponse }));

      const result = await service.discoverMovies(discoverDto);

      expect(result).toEqual(mockResponse);
      expect(mockHttpService.get).toHaveBeenCalledWith('/discover/movie', {
        params: { page: 2 },
      });
    });
  });

  describe('getMovieById', () => {
    it('should return movie details when movie exists', async () => {
      const movieId = 550;
      const mockMovieDetails: MovieDetailsDto = {
        id: 550,
        title: 'Fight Club',
        original_title: 'Fight Club',
        overview: 'A ticking-time-bomb insomniac...',
        poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
        backdrop_path: '/fCayJrkfRaCRCTh8GqN30f8oyQF.jpg',
        release_date: '1999-10-15',
        runtime: 139,
        vote_average: 8.433,
        vote_count: 27280,
        popularity: 61.416,
        adult: false,
        genres: [{ id: 18, name: 'Drama' }],
        production_companies: [],
        budget: 63000000,
        revenue: 100853753,
        tagline: 'Mischief. Mayhem. Soap.',
        homepage: 'http://www.foxmovies.com/movies/fight-club',
      };

      mockHttpService.get.mockReturnValue(of({ data: mockMovieDetails }));

      const result = await service.getMovieById(movieId);

      expect(result).toEqual(mockMovieDetails);
      expect(mockHttpService.get).toHaveBeenCalledWith('/movie/550');
    });

    it('should throw HttpException when movie not found', async () => {
      const movieId = 999999;
      const errorResponse = {
        response: { status: 404 },
        message: 'Not found',
      };

      mockHttpService.get.mockReturnValue(throwError(() => errorResponse));

      await expect(service.getMovieById(movieId)).rejects.toThrow(
        HttpException,
      );
      expect(mockHttpService.get).toHaveBeenCalledWith('/movie/999999');
    });
  });
});
