import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SupabaseService } from './supabase/supabase.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('AuthService', () => {
  let service: AuthService;
  let supabaseService: jest.Mocked<SupabaseService>;

  const mockSupabaseClient = {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: SupabaseService,
          useValue: {
            getClient: jest.fn().mockReturnValue(mockSupabaseClient),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    supabaseService = module.get(SupabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    const signInDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should return access token on successful login', async () => {
      const mockSession = {
        access_token: 'mock-access-token',
        user: { id: 'user-id', email: 'test@example.com' },
      };

      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      const result = await service.signIn(signInDto);

      expect(result).toEqual({
        access_token: 'mock-access-token',
      });
      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: signInDto.email,
        password: signInDto.password,
      });
    });

    it('should throw HttpException when credentials are invalid', async () => {
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { session: null },
        error: { message: 'Invalid credentials' },
      });

      await expect(service.signIn(signInDto)).rejects.toThrow(
        new HttpException(
          'Invalid credentials or session not found',
          HttpStatus.UNAUTHORIZED,
        ),
      );
    });

    it('should throw HttpException when session is null', async () => {
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      await expect(service.signIn(signInDto)).rejects.toThrow(
        new HttpException(
          'Invalid credentials or session not found',
          HttpStatus.UNAUTHORIZED,
        ),
      );
    });

    it('should throw HttpException when error occurs', async () => {
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { session: null },
        error: { message: 'Database error' },
      });

      await expect(service.signIn(signInDto)).rejects.toThrow(
        new HttpException(
          'Invalid credentials or session not found',
          HttpStatus.UNAUTHORIZED,
        ),
      );
    });
  });

  describe('signUp', () => {
    const signUpDto: CreateUserDto = {
      email: 'newuser@example.com',
      password: 'password123',
    };

    it('should create user successfully', async () => {
      const mockUser = {
        id: 'new-user-id',
        email: 'newuser@example.com',
      };

      mockSupabaseClient.auth.signUp.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      await expect(service.signUp(signUpDto)).resolves.toBeUndefined();
      expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith({
        email: signUpDto.email,
        password: signUpDto.password,
      });
    });

    it('should throw HttpException when signup error occurs', async () => {
      mockSupabaseClient.auth.signUp.mockResolvedValue({
        data: { user: null },
        error: { message: 'Email already exists' },
      });

      await expect(service.signUp(signUpDto)).rejects.toThrow(
        new HttpException('Email already exists', HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw HttpException when user is null', async () => {
      mockSupabaseClient.auth.signUp.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      await expect(service.signUp(signUpDto)).rejects.toThrow(
        new HttpException('Error creating user', HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw HttpException with generic message when error has no message', async () => {
      mockSupabaseClient.auth.signUp.mockResolvedValue({
        data: { user: null },
        error: {},
      });

      await expect(service.signUp(signUpDto)).rejects.toThrow(
        new HttpException('Error creating user', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      mockSupabaseClient.auth.signOut.mockResolvedValue({
        error: null,
      });

      const result = await service.logout();

      expect(result).toEqual({
        message: 'Logout successful',
      });
      expect(mockSupabaseClient.auth.signOut).toHaveBeenCalled();
    });

    it('should throw HttpException when logout error occurs', async () => {
      mockSupabaseClient.auth.signOut.mockResolvedValue({
        error: { message: 'Logout failed' },
      });

      await expect(service.logout()).rejects.toThrow(
        new HttpException(
          'Error during logout',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should have supabaseService injected', () => {
      expect(supabaseService).toBeDefined();
    });
  });
});
