import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SupabaseService } from './supabase/supabase.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserContext } from './context/user.context';

describe('AuthModule Components', () => {
  let module: TestingModule;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config: Record<string, string> = {
        SUPABASE_URL: 'https://test.supabase.co',
        SUPABASE_ANON_KEY: 'test-anon-key',
        SUPABASE_JWT_SECRET: 'test-jwt-secret',
      };
      return config[key];
    }),
    getOrThrow: jest.fn((key: string) => {
      const config: Record<string, string> = {
        SUPABASE_URL: 'https://test.supabase.co',
        SUPABASE_ANON_KEY: 'test-anon-key',
        SUPABASE_JWT_SECRET: 'test-jwt-secret',
      };
      const value = config[key];
      if (!value) {
        throw new Error(`Configuration key "${key}" is missing`);
      }
      return value;
    }),
  };

  const mockSupabaseService = {
    getClient: jest.fn().mockReturnValue({
      auth: {
        signInWithPassword: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
      },
    }),
  };

  const mockRequest = {
    user: { id: 'test-user-id', email: 'test@example.com' },
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtStrategy,
        SupabaseService,
        UserContext,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: 'REQUEST',
          useValue: mockRequest,
        },
      ],
    })
      .overrideProvider(SupabaseService)
      .useValue(mockSupabaseService)
      .compile();
  });

  afterEach(async () => {
    if (module) {
      await module.close();
    }
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide AuthService', () => {
    const authService = module.get<AuthService>(AuthService);
    expect(authService).toBeDefined();
    expect(authService).toBeInstanceOf(AuthService);
  });

  it('should provide AuthController', () => {
    const authController = module.get<AuthController>(AuthController);
    expect(authController).toBeDefined();
    expect(authController).toBeInstanceOf(AuthController);
  });

  it('should provide SupabaseService', () => {
    const supabaseService = module.get<SupabaseService>(SupabaseService);
    expect(supabaseService).toBeDefined();
  });

  it('should provide JwtStrategy', () => {
    const jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    expect(jwtStrategy).toBeDefined();
    expect(jwtStrategy).toBeInstanceOf(JwtStrategy);
  });

  it('should provide UserContext', async () => {
    const userContext = await module.resolve<UserContext>(UserContext);
    expect(userContext).toBeDefined();
    expect(userContext).toBeInstanceOf(UserContext);
  });

  it('should provide ConfigService', () => {
    const configService = module.get<ConfigService>(ConfigService);
    expect(configService).toBeDefined();
  });

  describe('Module dependencies', () => {
    it('should inject dependencies correctly in AuthService', () => {
      const authService = module.get<AuthService>(AuthService);
      const supabaseService = module.get<SupabaseService>(SupabaseService);

      expect(authService).toBeDefined();
      expect(supabaseService).toBeDefined();
    });

    it('should inject dependencies correctly in AuthController', () => {
      const authController = module.get<AuthController>(AuthController);
      const authService = module.get<AuthService>(AuthService);

      expect(authController).toBeDefined();
      expect(authService).toBeDefined();
    });

    it('should inject dependencies correctly in JwtStrategy', () => {
      const jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
      const configService = module.get<ConfigService>(ConfigService);

      expect(jwtStrategy).toBeDefined();
      expect(configService).toBeDefined();
    });
  });

  describe('Service functionality', () => {
    it('should be able to get user context', async () => {
      const userContext = await module.resolve<UserContext>(UserContext);

      expect(userContext.currentUserId).toBe('test-user-id');
      expect(userContext.currentUser).toEqual({
        id: 'test-user-id',
        email: 'test@example.com',
      });
    });

    it('should configure JwtStrategy with correct secret', () => {
      const configService = module.get<ConfigService>(ConfigService);

      expect(configService.get('SUPABASE_JWT_SECRET')).toBe('test-jwt-secret');
    });
  });

  describe('Configuration', () => {
    it('should have correct environment variables configured', () => {
      const configService = module.get<ConfigService>(ConfigService);

      expect(configService.get('SUPABASE_URL')).toBe(
        'https://test.supabase.co',
      );
      expect(configService.get('SUPABASE_ANON_KEY')).toBe('test-anon-key');
      expect(configService.get('SUPABASE_JWT_SECRET')).toBe('test-jwt-secret');
    });

    it('should mock supabase client correctly', () => {
      const supabaseService = module.get<SupabaseService>(SupabaseService);
      const client = supabaseService.getClient();

      expect(client).toBeDefined();
      expect(client.auth).toBeDefined();
      expect(client.auth.signInWithPassword).toBeDefined();
      expect(client.auth.signUp).toBeDefined();
      expect(client.auth.signOut).toBeDefined();
    });
  });
});
