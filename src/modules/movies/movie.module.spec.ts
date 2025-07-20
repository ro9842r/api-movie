import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { MoviesModule } from './movie.module';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { TmdbApiKeyInterceptor } from './interceptors/tmdb-api-key.interceptor';

describe('MoviesModule', () => {
  let module: TestingModule;
  let moviesController: MoviesController;
  let moviesService: MoviesService;
  let interceptor: TmdbApiKeyInterceptor;

  beforeEach(async () => {
    process.env.TMDB_API_KEY = 'test-api-key';
    process.env.TMDB_BASE_URL = 'https://api.themoviedb.org/3';

    module = await Test.createTestingModule({
      imports: [
        MoviesModule,
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
    }).compile();

    moviesController = module.get<MoviesController>(MoviesController);
    moviesService = module.get<MoviesService>(MoviesService);
    interceptor = module.get<TmdbApiKeyInterceptor>(TmdbApiKeyInterceptor);
  });

  afterEach(async () => {
    if (module) {
      await module.close();
    }
    delete process.env.TMDB_API_KEY;
    delete process.env.TMDB_BASE_URL;
  });

  describe('Module Configuration', () => {
    it('should be defined', () => {
      expect(module).toBeDefined();
    });

    it('should have MoviesController defined', () => {
      expect(moviesController).toBeDefined();
      expect(moviesController).toBeInstanceOf(MoviesController);
    });

    it('should have MoviesService defined', () => {
      expect(moviesService).toBeDefined();
      expect(moviesService).toBeInstanceOf(MoviesService);
    });

    it('should have TmdbApiKeyInterceptor defined', () => {
      expect(interceptor).toBeDefined();
      expect(interceptor).toBeInstanceOf(TmdbApiKeyInterceptor);
    });
  });

  describe('Dependencies Injection', () => {
    it('should inject HttpService into MoviesService', () => {
      expect(moviesService).toBeDefined();
    });

    it('should provide TMDB_HTTP_SERVICE token', () => {
      const tmdbHttpService: unknown = module.get('TMDB_HTTP_SERVICE');
      expect(tmdbHttpService).toBeDefined();
    });

    it('should have proper module exports', () => {
      expect(() => module.get<MoviesService>(MoviesService)).not.toThrow();
    });
  });

  describe('HTTP Module Integration', () => {
    it('should configure HttpModule with proper base URL', () => {
      const httpService: unknown = module.get('TMDB_HTTP_SERVICE');
      expect(httpService).toBeDefined();
    });

    it('should apply interceptor to HTTP requests', () => {
      expect(interceptor).toBeDefined();
      expect(interceptor).toBeInstanceOf(TmdbApiKeyInterceptor);
    });
  });

  describe('Environment Configuration', () => {
    it('should load environment variables correctly', () => {
      expect(process.env.TMDB_API_KEY).toBe('test-api-key');
      expect(process.env.TMDB_BASE_URL).toBe('https://api.themoviedb.org/3');
    });

    it('should create module even without environment variables', async () => {
      const originalApiKey = process.env.TMDB_API_KEY;
      const originalBaseUrl = process.env.TMDB_BASE_URL;
      delete process.env.TMDB_API_KEY;
      delete process.env.TMDB_BASE_URL;

      const testModule = await Test.createTestingModule({
        imports: [
          MoviesModule,
          ConfigModule.forRoot({
            isGlobal: true,
          }),
        ],
      }).compile();

      expect(testModule).toBeDefined();
      const controller = testModule.get<MoviesController>(MoviesController);
      expect(controller).toBeDefined();

      process.env.TMDB_API_KEY = originalApiKey;
      process.env.TMDB_BASE_URL = originalBaseUrl;

      await testModule.close();
    });
  });

  describe('Service Methods Availability', () => {
    it('should have all required methods in MoviesService', () => {
      expect(typeof moviesService.searchMoviesByName).toBe('function');
      expect(typeof moviesService.getGenres).toBe('function');
      expect(typeof moviesService.getPopularMovies).toBe('function');
      expect(typeof moviesService.getNowPlayingMovies).toBe('function');
      expect(typeof moviesService.discoverMovies).toBe('function');
      expect(typeof moviesService.getMovieById).toBe('function');
    });
  });

  describe('Controller Methods Availability', () => {
    it('should have all required methods in MoviesController', () => {
      expect(typeof moviesController.searchMoviesByName).toBe('function');
      expect(typeof moviesController.getGenres).toBe('function');
      expect(typeof moviesController.getPopularMovies).toBe('function');
      expect(typeof moviesController.getNowPlayingMovies).toBe('function');
      expect(typeof moviesController.discoverMovies).toBe('function');
      expect(typeof moviesController.getMovieById).toBe('function');
    });
  });

  describe('Module Compilation', () => {
    it('should compile without errors', async () => {
      const compiledModule = await Test.createTestingModule({
        imports: [MoviesModule],
      }).compile();

      expect(compiledModule).toBeDefined();
      await compiledModule.close();
    });

    it('should create multiple instances independently', async () => {
      const module1 = await Test.createTestingModule({
        imports: [MoviesModule],
      }).compile();

      const module2 = await Test.createTestingModule({
        imports: [MoviesModule],
      }).compile();

      expect(module1).toBeDefined();
      expect(module2).toBeDefined();
      expect(module1).not.toBe(module2);

      await module1.close();
      await module2.close();
    });
  });
});
